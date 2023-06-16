import mysql from 'mysql2';
import {Client} from "ssh2";

class DatabaseSingleton {
    constructor() {
        if (DatabaseSingleton.instance) {
            return DatabaseSingleton.instance;
        }

        this.isConnecting = false;
        this.database = null;
        this.sshConnection = null;

        DatabaseSingleton.instance = this;
    }

    async connect() {
        if (this.database) {
            return this.database.promise();
        }

        if (this.isConnecting) {
            await new Promise(resolve => setTimeout(resolve, 9000));
            return this.connect(config);
        }

        this.isConnecting = true;

        try {
            const sshConfig = {
                host: process.env.SSH_HOST,
                port: process.env.SSH_PORT,
                username: process.env.SSH_USERNAME,
                password: process.env.SSH_PASSWORD,
            };

            const dbConfig = {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                namedPlaceholders: true,
            };

            this.sshConnection = new Client();
            await new Promise((resolve, reject) => {
                this.sshConnection
                .on('ready', resolve)
                .on('error', reject)
                .connect(sshConfig);
            });

            await new Promise((resolve, reject) => {
                this.sshConnection.forwardOut(
                    'localhost',
                    0,
                    dbConfig.host,
                    dbConfig.port,
                    (err, stream) => {
                        if (err) {
                            reject(err);
                        } else {
                            dbConfig.stream = stream;
                            this.database = mysql.createConnection(dbConfig);
                            resolve();
                        }
                    }
                );
            });

            return this.database.promise();
        } catch (err) {
            console.error('Error:', error);
            this.close();
            throw error;
        } finally {
            this.isConnecting = false;
        }
    }

    close() {
        if (this.sshConnection) {
            this.sshConnection.end();
            this.sshConnection = null;
        }

        if (this.database) {
            this.database.end();
            this.database = null;
        }
    }

    async executeQuery(query) {
        try {
            const database = await this.connect();
            const [rows] = await database.query(query);
            return rows;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}

export default DatabaseSingleton;

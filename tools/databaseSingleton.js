import config  from "../credentials/config.js";
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
        console.log('isConnecting:', this.isConnecting);
        //console.log('database:', this.database);
        //console.log('shh:', this.sshConnection);

        if (this.database) {
            return this.database.promise();
        }

        if (this.isConnecting) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return this.connect(config);
        }

        this.isConnecting = true;

        try {
            const sshConfig = {
                host: config.sshHost,
                port: config.sshPort,
                username: config.sshUsername,
                password: config.sshPassword,
            };

            const dbConfig = {
                host: config.dbHost,
                port: config.dbPort,
                user: config.dbUsername,
                password: config.dbPassword,
                database: config.dbName,
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

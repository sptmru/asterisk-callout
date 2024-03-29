import { DataSource } from 'typeorm';

import { config } from '../config/config';
import { logger } from '../../misc/Logger';

const dataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  logging: config.db.logging,
  synchronize: false,
  entities: ['src/domain/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});

const dataSourceInitializer = async (ds: DataSource): Promise<void> => {
  try {
    await ds.initialize();
    logger.info(`Data source initialized successfully`);
  } catch (err) {
    logger.error(`Failed to initialize data source: ${err.message}`);
    throw err;
  }
};

export { dataSource, dataSourceInitializer };

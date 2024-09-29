export type ElasticConfigType = {
   ELASTIC_NODE: string | 'http://localhost:9200';
   ELASTIC_USER: string | 'elastic';
   ELASTIC_PASSWORD: string | 'changeme';
   ELASTIC_INDEX: string | 'app-logs';
   LOG_RETENTION_DAYS: number | 30;
   IS_SENDLOG: boolean | false;
};

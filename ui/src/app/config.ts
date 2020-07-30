import { environment } from '../environments/environment';

export const INSTANCE_NAME = process.env.PRODUCTION
  ? 'test-instance'
  : 'test-instance';
export const HOST_URL =  'ws://localhost:'+environment.ws_port//9998';// process.env.WS_INTERFACE;
export const USERNAME = undefined;

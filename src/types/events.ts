import { EventEmitter } from '@/lib/eventEmitter';

export type Emitter = EventEmitter<{
  'load:frame': [string];
  'refresh:frame': [];
  'setting:toggle': [boolean];
}>;

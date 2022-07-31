import EventEmitter from 'eventemitter3';

const eventEmitter = new EventEmitter();

const Emitter = {
  on: (event: any, fn: (...args: any[]) => void) =>
    eventEmitter.addListener(event, fn),
  once: (event: any, fn: (...args: any[]) => void) =>
    eventEmitter.once(event, fn),
  off: (event: any, fn: ((...args: any[]) => void) | undefined) =>
    eventEmitter.off(event, fn),
  emit: (event: any, payload: any) => eventEmitter.emit(event, payload),
};

Object.freeze(Emitter);

export default Emitter;

const utf8encoder = new TextEncoder();

export default class Buffer {
  le = true;
  offset = 0;
  needle = 0;

  constructor(data, opts = {}) {
    if ('le' in opts) this.le = opts.le;
    this.buffer = new Uint8Array(data).buffer;
    if ('offset' in opts) this.offset = opts.offset;
    this.needle = opts.needle ?? this.buffer.byteLength;

    this.length = this.buffer.byteLength;
    this.view = new DataView(this.buffer);
  }

  static from(data) {
    switch (typeof data) {
      case 'string':
        return new Buffer(utf8encoder.encode(data).buffer);

      default:
        return new Buffer(data);
    }
  }

  static concat(...arrays) {
    const array = new Uint8Array(
      arrays.reduce((length, array) => length + array.length, 0)
    );

    let offset = 0;
    for (const x of arrays) {
      array.set(x, offset);
      offset += x.length;
    }

    return new Buffer(array.buffer);
  }

  fits(length) {
    return this.length >= length + this.offset;
  }

  array() {
    return new Uint8Array(this.buffer, 0, this.needle);
  }

  slice(start, end = this.needle) {
    return new Uint8Array(this.buffer).subarray(start, end);
  }

  malloc(length) {
    if (this.fits(length)) return;
    this.length = 2 * (length + this.offset);
    const array = new Uint8Array(this.length);
    array.set(new Uint8Array(this.buffer), 0);

    this.buffer = array.buffer;
    this.view = new DataView(this.buffer);
  }

  get(length) {
    return this.slice(this.offset, (this.offset += length));
  }

  getFloat32() {
    const value = this.view.getFloat32(this.offset, this.le);
    this.offset += 4;
    return value;
  }
  getFloat64() {
    const value = this.view.getFloat64(this.offset, this.le);
    this.offset += 8;
    return value;
  }

  getInt8() {
    return this.view.getInt8(this.offset++);
  }
  getInt16() {
    const value = this.view.getInt16(this.offset, this.le);
    this.offset += 2;
    return value;
  }
  getInt32() {
    const value = this.view.getInt32(this.offset, this.le);
    this.offset += 4;
    return value;
  }
  getInt64() {
    const value = this.view.getBigInt64(this.offset, this.le);
    this.offset += 8;
    return value;
  }

  getUint8() {
    return this.view.getUint8(this.offset++);
  }
  getUint16() {
    const value = this.view.getUint16(this.offset, this.le);
    this.offset += 2;
    return value;
  }
  getUint32() {
    const value = this.view.getUint32(this.offset, this.le);
    this.offset += 4;
    return value;
  }
  getUint64() {
    const value = this.view.getBigUint64(this.offset, this.le);
    this.offset += 8;
    return value;
  }

  set(value) {
    this.malloc(value.length);
    new Uint8Array(this.buffer).set(value, this.offset);
    if (this.needle < (this.offset += value.length)) this.needle = this.offset;
  }

  setFloat32(value) {
    this.malloc(4);
    this.view.setFloat32(this.offset, value, this.le);
    if (this.needle < (this.offset += 4)) this.needle = this.offset;
  }
  setFloat64(value) {
    this.malloc(8);
    this.view.setFloat64(this.offset, value, this.le);
    if (this.needle < (this.offset += 8)) this.needle = this.offset;
  }

  setInt8(value) {
    this.malloc(1);
    this.view.setInt8(this.offset, value);
    if (this.needle < ++this.offset) this.needle = this.offset;
  }
  setInt16(value) {
    this.malloc(2);
    this.view.setInt16(this.offset, value, this.le);
    if (this.needle < (this.offset += 2)) this.needle = this.offset;
  }
  setInt32(value) {
    this.malloc(4);
    this.view.setInt32(this.offset, value, this.le);
    if (this.needle < (this.offset += 4)) this.needle = this.offset;
  }
  setInt64(value) {
    this.malloc(8);
    this.view.setBigInt64(this.offset, value, this.le);
    if (this.needle < (this.offset += 8)) this.needle = this.offset;
  }

  setUint8(value) {
    this.malloc(1);
    this.view.setUint8(this.offset, value);
    if (this.needle < ++this.offset) this.needle = this.offset;
  }
  setUint16(value) {
    this.malloc(2);
    this.view.setUint16(this.offset, value, this.le);
    if (this.needle < (this.offset += 2)) this.needle = this.offset;
  }
  setUint32(value) {
    this.malloc(4);
    this.view.setUint32(this.offset, value, this.le);
    if (this.needle < (this.offset += 4)) this.needle = this.offset;
  }
  setUint64(value) {
    this.malloc(8);
    this.view.setBigUint64(this.offset, value, this.le);
    if (this.needle < (this.offset += 8)) this.needle = this.offset;
  }
}

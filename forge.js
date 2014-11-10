(function(root){
root.forge={};

// js/util
(function(forge){
var util = forge.util = forge.util || {};
if (typeof process === 'undefined' || !process.nextTick) {
    if (typeof setImmediate === 'function') {
        util.setImmediate = setImmediate;
        util.nextTick = function (callback) {
            return setImmediate(callback);
        };
    } else {
        util.setImmediate = function (callback) {
            setTimeout(callback, 0);
        };
        util.nextTick = util.setImmediate;
    }
} else {
    util.nextTick = process.nextTick;
    if (typeof setImmediate === 'function') {
        util.setImmediate = setImmediate;
    } else {
        util.setImmediate = util.nextTick;
    }
}
util.isArray = Array.isArray || function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
};
util.isArrayBuffer = function (x) {
    return typeof ArrayBuffer !== 'undefined' && x instanceof ArrayBuffer;
};
var _arrayBufferViews = [];
if (typeof DataView !== 'undefined') {
    _arrayBufferViews.push(DataView);
}
if (typeof Int8Array !== 'undefined') {
    _arrayBufferViews.push(Int8Array);
}
if (typeof Uint8Array !== 'undefined') {
    _arrayBufferViews.push(Uint8Array);
}
if (typeof Uint8ClampedArray !== 'undefined') {
    _arrayBufferViews.push(Uint8ClampedArray);
}
if (typeof Int16Array !== 'undefined') {
    _arrayBufferViews.push(Int16Array);
}
if (typeof Uint16Array !== 'undefined') {
    _arrayBufferViews.push(Uint16Array);
}
if (typeof Int32Array !== 'undefined') {
    _arrayBufferViews.push(Int32Array);
}
if (typeof Uint32Array !== 'undefined') {
    _arrayBufferViews.push(Uint32Array);
}
if (typeof Float32Array !== 'undefined') {
    _arrayBufferViews.push(Float32Array);
}
if (typeof Float64Array !== 'undefined') {
    _arrayBufferViews.push(Float64Array);
}
util.isArrayBufferView = function (x) {
    for (var i = 0; i < _arrayBufferViews.length; ++i) {
        if (x instanceof _arrayBufferViews[i]) {
            return true;
        }
    }
    return false;
};
util.ByteBuffer = ByteStringBuffer;
function ByteStringBuffer(b) {
    this.data = '';
    this.read = 0;
    if (typeof b === 'string') {
        this.data = b;
    } else if (util.isArrayBuffer(b) || util.isArrayBufferView(b)) {
        var arr = new Uint8Array(b);
        try {
            this.data = String.fromCharCode.apply(null, arr);
        } catch (e) {
            for (var i = 0; i < arr.length; ++i) {
                this.putByte(arr[i]);
            }
        }
    } else if (b instanceof ByteStringBuffer || typeof b === 'object' && typeof b.data === 'string' && typeof b.read === 'number') {
        this.data = b.data;
        this.read = b.read;
    }
}
util.ByteStringBuffer = ByteStringBuffer;
util.ByteStringBuffer.prototype.length = function () {
    return this.data.length - this.read;
};
util.ByteStringBuffer.prototype.isEmpty = function () {
    return this.length() <= 0;
};
util.ByteStringBuffer.prototype.putByte = function (b) {
    this.data += String.fromCharCode(b);
    return this;
};
util.ByteStringBuffer.prototype.fillWithByte = function (b, n) {
    b = String.fromCharCode(b);
    var d = this.data;
    while (n > 0) {
        if (n & 1) {
            d += b;
        }
        n >>>= 1;
        if (n > 0) {
            b += b;
        }
    }
    this.data = d;
    return this;
};
util.ByteStringBuffer.prototype.putBytes = function (bytes) {
    this.data += bytes;
    return this;
};
util.ByteStringBuffer.prototype.putString = function (str) {
    this.data += util.encodeUtf8(str);
    return this;
};
util.ByteStringBuffer.prototype.putInt16 = function (i) {
    this.data += String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255);
    return this;
};
util.ByteStringBuffer.prototype.putInt24 = function (i) {
    this.data += String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255);
    return this;
};
util.ByteStringBuffer.prototype.putInt32 = function (i) {
    this.data += String.fromCharCode(i >> 24 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255);
    return this;
};
util.ByteStringBuffer.prototype.putInt16Le = function (i) {
    this.data += String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255);
    return this;
};
util.ByteStringBuffer.prototype.putInt24Le = function (i) {
    this.data += String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i >> 16 & 255);
    return this;
};
util.ByteStringBuffer.prototype.putInt32Le = function (i) {
    this.data += String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 24 & 255);
    return this;
};
util.ByteStringBuffer.prototype.putInt = function (i, n) {
    do {
        n -= 8;
        this.data += String.fromCharCode(i >> n & 255);
    } while (n > 0);
    return this;
};
util.ByteStringBuffer.prototype.putSignedInt = function (i, n) {
    if (i < 0) {
        i += 2 << n - 1;
    }
    return this.putInt(i, n);
};
util.ByteStringBuffer.prototype.putBuffer = function (buffer) {
    this.data += buffer.getBytes();
    return this;
};
util.ByteStringBuffer.prototype.getByte = function () {
    return this.data.charCodeAt(this.read++);
};
util.ByteStringBuffer.prototype.getInt16 = function () {
    var rval = this.data.charCodeAt(this.read) << 8 ^ this.data.charCodeAt(this.read + 1);
    this.read += 2;
    return rval;
};
util.ByteStringBuffer.prototype.getInt24 = function () {
    var rval = this.data.charCodeAt(this.read) << 16 ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2);
    this.read += 3;
    return rval;
};
util.ByteStringBuffer.prototype.getInt32 = function () {
    var rval = this.data.charCodeAt(this.read) << 24 ^ this.data.charCodeAt(this.read + 1) << 16 ^ this.data.charCodeAt(this.read + 2) << 8 ^ this.data.charCodeAt(this.read + 3);
    this.read += 4;
    return rval;
};
util.ByteStringBuffer.prototype.getInt16Le = function () {
    var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8;
    this.read += 2;
    return rval;
};
util.ByteStringBuffer.prototype.getInt24Le = function () {
    var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16;
    this.read += 3;
    return rval;
};
util.ByteStringBuffer.prototype.getInt32Le = function () {
    var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16 ^ this.data.charCodeAt(this.read + 3) << 24;
    this.read += 4;
    return rval;
};
util.ByteStringBuffer.prototype.getInt = function (n) {
    var rval = 0;
    do {
        rval = (rval << 8) + this.data.charCodeAt(this.read++);
        n -= 8;
    } while (n > 0);
    return rval;
};
util.ByteStringBuffer.prototype.getSignedInt = function (n) {
    var x = this.getInt(n);
    var max = 2 << n - 2;
    if (x >= max) {
        x -= max << 1;
    }
    return x;
};
util.ByteStringBuffer.prototype.getBytes = function (count) {
    var rval;
    if (count) {
        count = Math.min(this.length(), count);
        rval = this.data.slice(this.read, this.read + count);
        this.read += count;
    } else if (count === 0) {
        rval = '';
    } else {
        rval = this.read === 0 ? this.data : this.data.slice(this.read);
        this.clear();
    }
    return rval;
};
util.ByteStringBuffer.prototype.bytes = function (count) {
    return typeof count === 'undefined' ? this.data.slice(this.read) : this.data.slice(this.read, this.read + count);
};
util.ByteStringBuffer.prototype.at = function (i) {
    return this.data.charCodeAt(this.read + i);
};
util.ByteStringBuffer.prototype.setAt = function (i, b) {
    this.data = this.data.substr(0, this.read + i) + String.fromCharCode(b) + this.data.substr(this.read + i + 1);
    return this;
};
util.ByteStringBuffer.prototype.last = function () {
    return this.data.charCodeAt(this.data.length - 1);
};
util.ByteStringBuffer.prototype.copy = function () {
    var c = util.createBuffer(this.data);
    c.read = this.read;
    return c;
};
util.ByteStringBuffer.prototype.compact = function () {
    if (this.read > 0) {
        this.data = this.data.slice(this.read);
        this.read = 0;
    }
    return this;
};
util.ByteStringBuffer.prototype.clear = function () {
    this.data = '';
    this.read = 0;
    return this;
};
util.ByteStringBuffer.prototype.truncate = function (count) {
    var len = Math.max(0, this.length() - count);
    this.data = this.data.substr(this.read, len);
    this.read = 0;
    return this;
};
util.ByteStringBuffer.prototype.toHex = function () {
    var rval = '';
    for (var i = this.read; i < this.data.length; ++i) {
        var b = this.data.charCodeAt(i);
        if (b < 16) {
            rval += '0';
        }
        rval += b.toString(16);
    }
    return rval;
};
util.ByteStringBuffer.prototype.toString = function () {
    return util.decodeUtf8(this.bytes());
};
function DataBuffer(b, options) {
    options = options || {};
    this.read = options.readOffset || 0;
    this.growSize = options.growSize || 1024;
    var isArrayBuffer = util.isArrayBuffer(b);
    var isArrayBufferView = util.isArrayBufferView(b);
    if (isArrayBuffer || isArrayBufferView) {
        if (isArrayBuffer) {
            this.data = new DataView(b);
        } else {
            this.data = new DataView(b.buffer, b.byteOffset, b.byteLength);
        }
        this.write = 'writeOffset' in options ? options.writeOffset : this.data.byteLength;
        return;
    }
    this.data = new DataView(new ArrayBuffer(0));
    this.write = 0;
    if (b !== null && b !== undefined) {
        this.putBytes(b);
    }
    if ('writeOffset' in options) {
        this.write = options.writeOffset;
    }
}
util.DataBuffer = DataBuffer;
util.DataBuffer.prototype.length = function () {
    return this.write - this.read;
};
util.DataBuffer.prototype.isEmpty = function () {
    return this.length() <= 0;
};
util.DataBuffer.prototype.accommodate = function (amount, growSize) {
    if (this.length() >= amount) {
        return this;
    }
    growSize = Math.max(growSize || this.growSize, amount);
    var src = new Uint8Array(this.data.buffer, this.data.byteOffset, this.data.byteLength);
    var dst = new Uint8Array(this.length() + growSize);
    dst.set(src);
    this.data = new DataView(dst.buffer);
    return this;
};
util.DataBuffer.prototype.putByte = function (b) {
    this.accommodate(1);
    this.data.setUint8(this.write++, b);
    return this;
};
util.DataBuffer.prototype.fillWithByte = function (b, n) {
    this.accommodate(n);
    for (var i = 0; i < n; ++i) {
        this.data.setUint8(b);
    }
    return this;
};
util.DataBuffer.prototype.putBytes = function (bytes, encoding) {
    if (util.isArrayBufferView(bytes)) {
        var src = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        var len = src.byteLength - src.byteOffset;
        this.accommodate(len);
        var dst = new Uint8Array(this.data.buffer, this.write);
        dst.set(src);
        this.write += len;
        return this;
    }
    if (util.isArrayBuffer(bytes)) {
        var src = new Uint8Array(bytes);
        this.accommodate(src.byteLength);
        var dst = new Uint8Array(this.data.buffer);
        dst.set(src, this.write);
        this.write += src.byteLength;
        return this;
    }
    if (bytes instanceof util.DataBuffer || typeof bytes === 'object' && typeof bytes.read === 'number' && typeof bytes.write === 'number' && util.isArrayBufferView(bytes.data)) {
        var src = new Uint8Array(bytes.data.byteLength, bytes.read, bytes.length());
        this.accommodate(src.byteLength);
        var dst = new Uint8Array(bytes.data.byteLength, this.write);
        dst.set(src);
        this.write += src.byteLength;
        return this;
    }
    if (bytes instanceof util.ByteStringBuffer) {
        bytes = bytes.data;
        encoding = 'binary';
    }
    encoding = encoding || 'binary';
    if (typeof bytes === 'string') {
        var view;
        if (encoding === 'hex') {
            this.accommodate(Math.ceil(bytes.length / 2));
            view = new Uint8Array(this.data.buffer, this.write);
            this.write += util.binary.hex.decode(bytes, view, this.write);
            return this;
        }
        if (encoding === 'base64') {
            this.accommodate(Math.ceil(bytes.length / 4) * 3);
            view = new Uint8Array(this.data.buffer, this.write);
            this.write += util.binary.base64.decode(bytes, view, this.write);
            return this;
        }
        if (encoding === 'utf8') {
            bytes = util.encodeUtf8(bytes);
            encoding = 'binary';
        }
        if (encoding === 'binary' || encoding === 'raw') {
            this.accommodate(bytes.length);
            view = new Uint8Array(this.data.buffer, this.write);
            this.write += util.binary.raw.decode(view);
            return this;
        }
        if (encoding === 'utf16') {
            this.accommodate(bytes.length * 2);
            view = new Uint16Array(this.data.buffer, this.write);
            this.write += util.text.utf16.encode(view);
            return this;
        }
        throw new Error('Invalid encoding: ' + encoding);
    }
    throw Error('Invalid parameter: ' + bytes);
};
util.DataBuffer.prototype.putBuffer = function (buffer) {
    this.putBytes(buffer);
    buffer.clear();
    return this;
};
util.DataBuffer.prototype.putString = function (str) {
    return this.putBytes(str, 'utf16');
};
util.DataBuffer.prototype.putInt16 = function (i) {
    this.accommodate(2);
    this.data.setInt16(this.write, i);
    this.write += 2;
    return this;
};
util.DataBuffer.prototype.putInt24 = function (i) {
    this.accommodate(3);
    this.data.setInt16(this.write, i >> 8 & 65535);
    this.data.setInt8(this.write, i >> 16 & 255);
    this.write += 3;
    return this;
};
util.DataBuffer.prototype.putInt32 = function (i) {
    this.accommodate(4);
    this.data.setInt32(this.write, i);
    this.write += 4;
    return this;
};
util.DataBuffer.prototype.putInt16Le = function (i) {
    this.accommodate(2);
    this.data.setInt16(this.write, i, true);
    this.write += 2;
    return this;
};
util.DataBuffer.prototype.putInt24Le = function (i) {
    this.accommodate(3);
    this.data.setInt8(this.write, i >> 16 & 255);
    this.data.setInt16(this.write, i >> 8 & 65535, true);
    this.write += 3;
    return this;
};
util.DataBuffer.prototype.putInt32Le = function (i) {
    this.accommodate(4);
    this.data.setInt32(this.write, i, true);
    this.write += 4;
    return this;
};
util.DataBuffer.prototype.putInt = function (i, n) {
    this.accommodate(n / 8);
    do {
        n -= 8;
        this.data.setInt8(this.write++, i >> n & 255);
    } while (n > 0);
    return this;
};
util.DataBuffer.prototype.putSignedInt = function (i, n) {
    this.accommodate(n / 8);
    if (i < 0) {
        i += 2 << n - 1;
    }
    return this.putInt(i, n);
};
util.DataBuffer.prototype.getByte = function () {
    return this.data.getInt8(this.read++);
};
util.DataBuffer.prototype.getInt16 = function () {
    var rval = this.data.getInt16(this.read);
    this.read += 2;
    return rval;
};
util.DataBuffer.prototype.getInt24 = function () {
    var rval = this.data.getInt16(this.read) << 8 ^ this.data.getInt8(this.read + 2);
    this.read += 3;
    return rval;
};
util.DataBuffer.prototype.getInt32 = function () {
    var rval = this.data.getInt32(this.read);
    this.read += 4;
    return rval;
};
util.DataBuffer.prototype.getInt16Le = function () {
    var rval = this.data.getInt16(this.read, true);
    this.read += 2;
    return rval;
};
util.DataBuffer.prototype.getInt24Le = function () {
    var rval = this.data.getInt8(this.read) ^ this.data.getInt16(this.read + 1, true) << 8;
    this.read += 3;
    return rval;
};
util.DataBuffer.prototype.getInt32Le = function () {
    var rval = this.data.getInt32(this.read, true);
    this.read += 4;
    return rval;
};
util.DataBuffer.prototype.getInt = function (n) {
    var rval = 0;
    do {
        rval = (rval << 8) + this.data.getInt8(this.read++);
        n -= 8;
    } while (n > 0);
    return rval;
};
util.DataBuffer.prototype.getSignedInt = function (n) {
    var x = this.getInt(n);
    var max = 2 << n - 2;
    if (x >= max) {
        x -= max << 1;
    }
    return x;
};
util.DataBuffer.prototype.getBytes = function (count) {
    var rval;
    if (count) {
        count = Math.min(this.length(), count);
        rval = this.data.slice(this.read, this.read + count);
        this.read += count;
    } else if (count === 0) {
        rval = '';
    } else {
        rval = this.read === 0 ? this.data : this.data.slice(this.read);
        this.clear();
    }
    return rval;
};
util.DataBuffer.prototype.bytes = function (count) {
    return typeof count === 'undefined' ? this.data.slice(this.read) : this.data.slice(this.read, this.read + count);
};
util.DataBuffer.prototype.at = function (i) {
    return this.data.getUint8(this.read + i);
};
util.DataBuffer.prototype.setAt = function (i, b) {
    this.data.setUint8(i, b);
    return this;
};
util.DataBuffer.prototype.last = function () {
    return this.data.getUint8(this.write - 1);
};
util.DataBuffer.prototype.copy = function () {
    return new util.DataBuffer(this);
};
util.DataBuffer.prototype.compact = function () {
    if (this.read > 0) {
        var src = new Uint8Array(this.data.buffer, this.read);
        var dst = new Uint8Array(src.byteLength);
        dst.set(src);
        this.data = new DataView(dst);
        this.write -= this.read;
        this.read = 0;
    }
    return this;
};
util.DataBuffer.prototype.clear = function () {
    this.data = new DataView(new ArrayBuffer(0));
    this.read = this.write = 0;
    return this;
};
util.DataBuffer.prototype.truncate = function (count) {
    this.write = Math.max(0, this.length() - count);
    this.read = Math.min(this.read, this.write);
    return this;
};
util.DataBuffer.prototype.toHex = function () {
    var rval = '';
    for (var i = this.read; i < this.data.byteLength; ++i) {
        var b = this.data.getUint8(i);
        if (b < 16) {
            rval += '0';
        }
        rval += b.toString(16);
    }
    return rval;
};
util.DataBuffer.prototype.toString = function (encoding) {
    var view = new Uint8Array(this.data, this.read, this.length());
    encoding = encoding || 'utf8';
    if (encoding === 'binary' || encoding === 'raw') {
        return util.binary.raw.encode(view);
    }
    if (encoding === 'hex') {
        return util.binary.hex.encode(view);
    }
    if (encoding === 'base64') {
        return util.binary.base64.encode(view);
    }
    if (encoding === 'utf8') {
        return util.text.utf8.decode(view);
    }
    if (encoding === 'utf16') {
        return util.text.utf16.decode(view);
    }
    throw new Error('Invalid encoding: ' + encoding);
};
util.createBuffer = function (input, encoding) {
    encoding = encoding || 'raw';
    if (input !== undefined && encoding === 'utf8') {
        input = util.encodeUtf8(input);
    }
    return new util.ByteBuffer(input);
};
util.fillString = function (c, n) {
    var s = '';
    while (n > 0) {
        if (n & 1) {
            s += c;
        }
        n >>>= 1;
        if (n > 0) {
            c += c;
        }
    }
    return s;
};
util.xorBytes = function (s1, s2, n) {
    var s3 = '';
    var b = '';
    var t = '';
    var i = 0;
    var c = 0;
    for (; n > 0; --n, ++i) {
        b = s1.charCodeAt(i) ^ s2.charCodeAt(i);
        if (c >= 10) {
            s3 += t;
            t = '';
            c = 0;
        }
        t += String.fromCharCode(b);
        ++c;
    }
    s3 += t;
    return s3;
};
util.hexToBytes = function (hex) {
    var rval = '';
    var i = 0;
    if (hex.length & 1 == 1) {
        i = 1;
        rval += String.fromCharCode(parseInt(hex[0], 16));
    }
    for (; i < hex.length; i += 2) {
        rval += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return rval;
};
util.bytesToHex = function (bytes) {
    return util.createBuffer(bytes).toHex();
};
util.int32ToBytes = function (i) {
    return String.fromCharCode(i >> 24 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255);
};
var _base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var _base64Idx = [
    62,
    -1,
    -1,
    -1,
    63,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    -1,
    -1,
    -1,
    64,
    -1,
    -1,
    -1,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51
];
util.encode64 = function (input, maxline) {
    var line = '';
    var output = '';
    var chr1, chr2, chr3;
    var i = 0;
    while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        line += _base64.charAt(chr1 >> 2);
        line += _base64.charAt((chr1 & 3) << 4 | chr2 >> 4);
        if (isNaN(chr2)) {
            line += '==';
        } else {
            line += _base64.charAt((chr2 & 15) << 2 | chr3 >> 6);
            line += isNaN(chr3) ? '=' : _base64.charAt(chr3 & 63);
        }
        if (maxline && line.length > maxline) {
            output += line.substr(0, maxline) + '\r\n';
            line = line.substr(maxline);
        }
    }
    output += line;
    return output;
};
util.decode64 = function (input) {
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
    var output = '';
    var enc1, enc2, enc3, enc4;
    var i = 0;
    while (i < input.length) {
        enc1 = _base64Idx[input.charCodeAt(i++) - 43];
        enc2 = _base64Idx[input.charCodeAt(i++) - 43];
        enc3 = _base64Idx[input.charCodeAt(i++) - 43];
        enc4 = _base64Idx[input.charCodeAt(i++) - 43];
        output += String.fromCharCode(enc1 << 2 | enc2 >> 4);
        if (enc3 !== 64) {
            output += String.fromCharCode((enc2 & 15) << 4 | enc3 >> 2);
            if (enc4 !== 64) {
                output += String.fromCharCode((enc3 & 3) << 6 | enc4);
            }
        }
    }
    return output;
};
util.encodeUtf8 = function (str) {
    return unescape(encodeURIComponent(str));
};
util.decodeUtf8 = function (str) {
    return decodeURIComponent(escape(str));
};
util.binary = {
    raw: {},
    hex: {},
    base64: {}
};
util.binary.raw.encode = function (bytes) {
    return String.fromCharCode.apply(null, bytes);
};
util.binary.raw.decode = function (str, output, offset) {
    var out = output;
    if (!out) {
        out = new Uint8Array(str.length);
    }
    offset = offset || 0;
    var j = offset;
    for (var i = 0; i < str.length; ++i) {
        out[j++] = str.charCodeAt(i);
    }
    return output ? j - offset : out;
};
util.binary.hex.encode = util.bytesToHex;
util.binary.hex.decode = function (hex, output, offset) {
    var out = output;
    if (!out) {
        out = new Uint8Array(Math.ceil(hex.length / 2));
    }
    offset = offset || 0;
    var i = 0, j = offset;
    if (hex.length & 1) {
        i = 1;
        out[j++] = parseInt(hex[0], 16);
    }
    for (; i < hex.length; i += 2) {
        out[j++] = parseInt(hex.substr(i, 2), 16);
    }
    return output ? j - offset : out;
};
util.binary.base64.encode = function (input, maxline) {
    var line = '';
    var output = '';
    var chr1, chr2, chr3;
    var i = 0;
    while (i < input.byteLength) {
        chr1 = input[i++];
        chr2 = input[i++];
        chr3 = input[i++];
        line += _base64.charAt(chr1 >> 2);
        line += _base64.charAt((chr1 & 3) << 4 | chr2 >> 4);
        if (isNaN(chr2)) {
            line += '==';
        } else {
            line += _base64.charAt((chr2 & 15) << 2 | chr3 >> 6);
            line += isNaN(chr3) ? '=' : _base64.charAt(chr3 & 63);
        }
        if (maxline && line.length > maxline) {
            output += line.substr(0, maxline) + '\r\n';
            line = line.substr(maxline);
        }
    }
    output += line;
    return output;
};
util.binary.base64.decode = function (input, output, offset) {
    var out = output;
    if (!out) {
        out = new Uint8Array(Math.ceil(input.length / 4) * 3);
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
    offset = offset || 0;
    var enc1, enc2, enc3, enc4;
    var i = 0, j = offset;
    while (i < input.length) {
        enc1 = _base64Idx[input.charCodeAt(i++) - 43];
        enc2 = _base64Idx[input.charCodeAt(i++) - 43];
        enc3 = _base64Idx[input.charCodeAt(i++) - 43];
        enc4 = _base64Idx[input.charCodeAt(i++) - 43];
        out[j++] = enc1 << 2 | enc2 >> 4;
        if (enc3 !== 64) {
            out[j++] = (enc2 & 15) << 4 | enc3 >> 2;
            if (enc4 !== 64) {
                out[j++] = (enc3 & 3) << 6 | enc4;
            }
        }
    }
    return output ? j - offset : out;
};
util.text = {
    utf8: {},
    utf16: {}
};
util.text.utf8.encode = function (str, output, offset) {
    str = util.encodeUtf8(str);
    var out = output;
    if (!out) {
        out = new Uint8Array(str.length);
    }
    offset = offset || 0;
    var j = offset;
    for (var i = 0; i < str.length; ++i) {
        out[j++] = str.charCodeAt(i);
    }
    return output ? j - offset : out;
};
util.text.utf8.decode = function (bytes) {
    return util.decodeUtf8(String.fromCharCode.apply(null, bytes));
};
util.text.utf16.encode = function (str, output, offset) {
    var out = output;
    if (!out) {
        out = new Uint8Array(str.length);
    }
    var view = new Uint16Array(out);
    offset = offset || 0;
    var j = offset;
    var k = offset;
    for (var i = 0; i < str.length; ++i) {
        view[k++] = str.charCodeAt(i);
        j += 2;
    }
    return output ? j - offset : out;
};
util.text.utf16.decode = function (bytes) {
    return String.fromCharCode.apply(null, new Uint16Array(bytes));
};
util.deflate = function (api, bytes, raw) {
    bytes = util.decode64(api.deflate(util.encode64(bytes)).rval);
    if (raw) {
        var start = 2;
        var flg = bytes.charCodeAt(1);
        if (flg & 32) {
            start = 6;
        }
        bytes = bytes.substring(start, bytes.length - 4);
    }
    return bytes;
};
util.inflate = function (api, bytes, raw) {
    var rval = api.inflate(util.encode64(bytes)).rval;
    return rval === null ? null : util.decode64(rval);
};
var _setStorageObject = function (api, id, obj) {
    if (!api) {
        throw new Error('WebStorage not available.');
    }
    var rval;
    if (obj === null) {
        rval = api.removeItem(id);
    } else {
        obj = util.encode64(JSON.stringify(obj));
        rval = api.setItem(id, obj);
    }
    if (typeof rval !== 'undefined' && rval.rval !== true) {
        var error = new Error(rval.error.message);
        error.id = rval.error.id;
        error.name = rval.error.name;
        throw error;
    }
};
var _getStorageObject = function (api, id) {
    if (!api) {
        throw new Error('WebStorage not available.');
    }
    var rval = api.getItem(id);
    if (api.init) {
        if (rval.rval === null) {
            if (rval.error) {
                var error = new Error(rval.error.message);
                error.id = rval.error.id;
                error.name = rval.error.name;
                throw error;
            }
            rval = null;
        } else {
            rval = rval.rval;
        }
    }
    if (rval !== null) {
        rval = JSON.parse(util.decode64(rval));
    }
    return rval;
};
var _setItem = function (api, id, key, data) {
    var obj = _getStorageObject(api, id);
    if (obj === null) {
        obj = {};
    }
    obj[key] = data;
    _setStorageObject(api, id, obj);
};
var _getItem = function (api, id, key) {
    var rval = _getStorageObject(api, id);
    if (rval !== null) {
        rval = key in rval ? rval[key] : null;
    }
    return rval;
};
var _removeItem = function (api, id, key) {
    var obj = _getStorageObject(api, id);
    if (obj !== null && key in obj) {
        delete obj[key];
        var empty = true;
        for (var prop in obj) {
            empty = false;
            break;
        }
        if (empty) {
            obj = null;
        }
        _setStorageObject(api, id, obj);
    }
};
var _clearItems = function (api, id) {
    _setStorageObject(api, id, null);
};
var _callStorageFunction = function (func, args, location) {
    var rval = null;
    if (typeof location === 'undefined') {
        location = [
            'web',
            'flash'
        ];
    }
    var type;
    var done = false;
    var exception = null;
    for (var idx in location) {
        type = location[idx];
        try {
            if (type === 'flash' || type === 'both') {
                if (args[0] === null) {
                    throw new Error('Flash local storage not available.');
                }
                rval = func.apply(this, args);
                done = type === 'flash';
            }
            if (type === 'web' || type === 'both') {
                args[0] = localStorage;
                rval = func.apply(this, args);
                done = true;
            }
        } catch (ex) {
            exception = ex;
        }
        if (done) {
            break;
        }
    }
    if (!done) {
        throw exception;
    }
    return rval;
};
util.setItem = function (api, id, key, data, location) {
    _callStorageFunction(_setItem, arguments, location);
};
util.getItem = function (api, id, key, location) {
    return _callStorageFunction(_getItem, arguments, location);
};
util.removeItem = function (api, id, key, location) {
    _callStorageFunction(_removeItem, arguments, location);
};
util.clearItems = function (api, id, location) {
    _callStorageFunction(_clearItems, arguments, location);
};
util.parseUrl = function (str) {
    var regex = /^(https?):\/\/([^:&^\/]*):?(\d*)(.*)$/g;
    regex.lastIndex = 0;
    var m = regex.exec(str);
    var url = m === null ? null : {
        full: str,
        scheme: m[1],
        host: m[2],
        port: m[3],
        path: m[4]
    };
    if (url) {
        url.fullHost = url.host;
        if (url.port) {
            if (url.port !== 80 && url.scheme === 'http') {
                url.fullHost += ':' + url.port;
            } else if (url.port !== 443 && url.scheme === 'https') {
                url.fullHost += ':' + url.port;
            }
        } else if (url.scheme === 'http') {
            url.port = 80;
        } else if (url.scheme === 'https') {
            url.port = 443;
        }
        url.full = url.scheme + '://' + url.fullHost;
    }
    return url;
};
var _queryVariables = null;
util.getQueryVariables = function (query) {
    var parse = function (q) {
        var rval = {};
        var kvpairs = q.split('&');
        for (var i = 0; i < kvpairs.length; i++) {
            var pos = kvpairs[i].indexOf('=');
            var key;
            var val;
            if (pos > 0) {
                key = kvpairs[i].substring(0, pos);
                val = kvpairs[i].substring(pos + 1);
            } else {
                key = kvpairs[i];
                val = null;
            }
            if (!(key in rval)) {
                rval[key] = [];
            }
            if (!(key in Object.prototype) && val !== null) {
                rval[key].push(unescape(val));
            }
        }
        return rval;
    };
    var rval;
    if (typeof query === 'undefined') {
        if (_queryVariables === null) {
            if (typeof window === 'undefined') {
                _queryVariables = {};
            } else {
                _queryVariables = parse(window.location.search.substring(1));
            }
        }
        rval = _queryVariables;
    } else {
        rval = parse(query);
    }
    return rval;
};
util.parseFragment = function (fragment) {
    var fp = fragment;
    var fq = '';
    var pos = fragment.indexOf('?');
    if (pos > 0) {
        fp = fragment.substring(0, pos);
        fq = fragment.substring(pos + 1);
    }
    var path = fp.split('/');
    if (path.length > 0 && path[0] === '') {
        path.shift();
    }
    var query = fq === '' ? {} : util.getQueryVariables(fq);
    return {
        pathString: fp,
        queryString: fq,
        path: path,
        query: query
    };
};
util.makeRequest = function (reqString) {
    var frag = util.parseFragment(reqString);
    var req = {
        path: frag.pathString,
        query: frag.queryString,
        getPath: function (i) {
            return typeof i === 'undefined' ? frag.path : frag.path[i];
        },
        getQuery: function (k, i) {
            var rval;
            if (typeof k === 'undefined') {
                rval = frag.query;
            } else {
                rval = frag.query[k];
                if (rval && typeof i !== 'undefined') {
                    rval = rval[i];
                }
            }
            return rval;
        },
        getQueryLast: function (k, _default) {
            var rval;
            var vals = req.getQuery(k);
            if (vals) {
                rval = vals[vals.length - 1];
            } else {
                rval = _default;
            }
            return rval;
        }
    };
    return req;
};
util.makeLink = function (path, query, fragment) {
    path = jQuery.isArray(path) ? path.join('/') : path;
    var qstr = jQuery.param(query || {});
    fragment = fragment || '';
    return path + (qstr.length > 0 ? '?' + qstr : '') + (fragment.length > 0 ? '#' + fragment : '');
};
util.setPath = function (object, keys, value) {
    if (typeof object === 'object' && object !== null) {
        var i = 0;
        var len = keys.length;
        while (i < len) {
            var next = keys[i++];
            if (i == len) {
                object[next] = value;
            } else {
                var hasNext = next in object;
                if (!hasNext || hasNext && typeof object[next] !== 'object' || hasNext && object[next] === null) {
                    object[next] = {};
                }
                object = object[next];
            }
        }
    }
};
util.getPath = function (object, keys, _default) {
    var i = 0;
    var len = keys.length;
    var hasNext = true;
    while (hasNext && i < len && typeof object === 'object' && object !== null) {
        var next = keys[i++];
        hasNext = next in object;
        if (hasNext) {
            object = object[next];
        }
    }
    return hasNext ? object : _default;
};
util.deletePath = function (object, keys) {
    if (typeof object === 'object' && object !== null) {
        var i = 0;
        var len = keys.length;
        while (i < len) {
            var next = keys[i++];
            if (i == len) {
                delete object[next];
            } else {
                if (!(next in object) || typeof object[next] !== 'object' || object[next] === null) {
                    break;
                }
                object = object[next];
            }
        }
    }
};
util.isEmpty = function (obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }
    return true;
};
util.format = function (format) {
    var re = /%./g;
    var match;
    var part;
    var argi = 0;
    var parts = [];
    var last = 0;
    while (match = re.exec(format)) {
        part = format.substring(last, re.lastIndex - 2);
        if (part.length > 0) {
            parts.push(part);
        }
        last = re.lastIndex;
        var code = match[0][1];
        switch (code) {
        case 's':
        case 'o':
            if (argi < arguments.length) {
                parts.push(arguments[argi++ + 1]);
            } else {
                parts.push('<?>');
            }
            break;
        case '%':
            parts.push('%');
            break;
        default:
            parts.push('<%' + code + '?>');
        }
    }
    parts.push(format.substring(last));
    return parts.join('');
};
util.formatNumber = function (number, decimals, dec_point, thousands_sep) {
    var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
    var d = dec_point === undefined ? ',' : dec_point;
    var t = thousands_sep === undefined ? '.' : thousands_sep, s = n < 0 ? '-' : '';
    var i = parseInt(n = Math.abs(+n || 0).toFixed(c), 10) + '';
    var j = i.length > 3 ? i.length % 3 : 0;
    return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};
util.formatSize = function (size) {
    if (size >= 1073741824) {
        size = util.formatNumber(size / 1073741824, 2, '.', '') + ' GiB';
    } else if (size >= 1048576) {
        size = util.formatNumber(size / 1048576, 2, '.', '') + ' MiB';
    } else if (size >= 1024) {
        size = util.formatNumber(size / 1024, 0) + ' KiB';
    } else {
        size = util.formatNumber(size, 0) + ' bytes';
    }
    return size;
};
util.bytesFromIP = function (ip) {
    if (ip.indexOf('.') !== -1) {
        return util.bytesFromIPv4(ip);
    }
    if (ip.indexOf(':') !== -1) {
        return util.bytesFromIPv6(ip);
    }
    return null;
};
util.bytesFromIPv4 = function (ip) {
    ip = ip.split('.');
    if (ip.length !== 4) {
        return null;
    }
    var b = util.createBuffer();
    for (var i = 0; i < ip.length; ++i) {
        var num = parseInt(ip[i], 10);
        if (isNaN(num)) {
            return null;
        }
        b.putByte(num);
    }
    return b.getBytes();
};
util.bytesFromIPv6 = function (ip) {
    var blanks = 0;
    ip = ip.split(':').filter(function (e) {
        if (e.length === 0)
            ++blanks;
        return true;
    });
    var zeros = (8 - ip.length + blanks) * 2;
    var b = util.createBuffer();
    for (var i = 0; i < 8; ++i) {
        if (!ip[i] || ip[i].length === 0) {
            b.fillWithByte(0, zeros);
            zeros = 0;
            continue;
        }
        var bytes = util.hexToBytes(ip[i]);
        if (bytes.length < 2) {
            b.putByte(0);
        }
        b.putBytes(bytes);
    }
    return b.getBytes();
};
util.bytesToIP = function (bytes) {
    if (bytes.length === 4) {
        return util.bytesToIPv4(bytes);
    }
    if (bytes.length === 16) {
        return util.bytesToIPv6(bytes);
    }
    return null;
};
util.bytesToIPv4 = function (bytes) {
    if (bytes.length !== 4) {
        return null;
    }
    var ip = [];
    for (var i = 0; i < bytes.length; ++i) {
        ip.push(bytes.charCodeAt(i));
    }
    return ip.join('.');
};
util.bytesToIPv6 = function (bytes) {
    if (bytes.length !== 16) {
        return null;
    }
    var ip = [];
    var zeroGroups = [];
    var zeroMaxGroup = 0;
    for (var i = 0; i < bytes.length; i += 2) {
        var hex = util.bytesToHex(bytes[i] + bytes[i + 1]);
        while (hex[0] === '0' && hex !== '0') {
            hex = hex.substr(1);
        }
        if (hex === '0') {
            var last = zeroGroups[zeroGroups.length - 1];
            var idx = ip.length;
            if (!last || idx !== last.end + 1) {
                zeroGroups.push({
                    start: idx,
                    end: idx
                });
            } else {
                last.end = idx;
                if (last.end - last.start > zeroGroups[zeroMaxGroup].end - zeroGroups[zeroMaxGroup].start) {
                    zeroMaxGroup = zeroGroups.length - 1;
                }
            }
        }
        ip.push(hex);
    }
    if (zeroGroups.length > 0) {
        var group = zeroGroups[zeroMaxGroup];
        if (group.end - group.start > 0) {
            ip.splice(group.start, group.end - group.start + 1, '');
            if (group.start === 0) {
                ip.unshift('');
            }
            if (group.end === 7) {
                ip.push('');
            }
        }
    }
    return ip.join(':');
};
util.estimateCores = function (options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }
    options = options || {};
    if ('cores' in util && !options.update) {
        return callback(null, util.cores);
    }
    if (typeof navigator !== 'undefined' && 'hardwareConcurrency' in navigator && navigator.hardwareConcurrency > 0) {
        util.cores = navigator.hardwareConcurrency;
        return callback(null, util.cores);
    }
    if (typeof Worker === 'undefined') {
        util.cores = 1;
        return callback(null, util.cores);
    }
    if (typeof Blob === 'undefined') {
        util.cores = 2;
        return callback(null, util.cores);
    }
    var blobUrl = URL.createObjectURL(new Blob([
        '(',
        function () {
            self.addEventListener('message', function (e) {
                var st = Date.now();
                var et = st + 4;
                while (Date.now() < et);
                self.postMessage({
                    st: st,
                    et: et
                });
            });
        }.toString(),
        ')()'
    ], { type: 'application/javascript' }));
    sample([], 5, 16);
    function sample(max, samples, numWorkers) {
        if (samples === 0) {
            var avg = Math.floor(max.reduce(function (avg, x) {
                return avg + x;
            }, 0) / max.length);
            util.cores = Math.max(1, avg);
            URL.revokeObjectURL(blobUrl);
            return callback(null, util.cores);
        }
        map(numWorkers, function (err, results) {
            max.push(reduce(numWorkers, results));
            sample(max, samples - 1, numWorkers);
        });
    }
    function map(numWorkers, callback) {
        var workers = [];
        var results = [];
        for (var i = 0; i < numWorkers; ++i) {
            var worker = new Worker(blobUrl);
            worker.addEventListener('message', function (e) {
                results.push(e.data);
                if (results.length === numWorkers) {
                    for (var i = 0; i < numWorkers; ++i) {
                        workers[i].terminate();
                    }
                    callback(null, results);
                }
            });
            workers.push(worker);
        }
        for (var i = 0; i < numWorkers; ++i) {
            workers[i].postMessage(i);
        }
    }
    function reduce(numWorkers, results) {
        var overlaps = [];
        for (var n = 0; n < numWorkers; ++n) {
            var r1 = results[n];
            var overlap = overlaps[n] = [];
            for (var i = 0; i < numWorkers; ++i) {
                if (n === i) {
                    continue;
                }
                var r2 = results[i];
                if (r1.st > r2.st && r1.st < r2.et || r2.st > r1.st && r2.st < r1.et) {
                    overlap.push(i);
                }
            }
        }
        return overlaps.reduce(function (max, overlap) {
            return Math.max(max, overlap.length);
        }, 0);
    }
};

}(root.forge));


// js/md5
(function(forge){
var md5 = forge.md5 = forge.md5 || {};
forge.md = forge.md || {};
forge.md.algorithms = forge.md.algorithms || {};
forge.md.md5 = forge.md.algorithms.md5 = md5;
md5.create = function () {
    if (!_initialized) {
        _init();
    }
    var _state = null;
    var _input = forge.util.createBuffer();
    var _w = new Array(16);
    var md = {
        algorithm: 'md5',
        blockLength: 64,
        digestLength: 16,
        messageLength: 0,
        messageLength64: [
            0,
            0
        ]
    };
    md.start = function () {
        md.messageLength = 0;
        md.messageLength64 = [
            0,
            0
        ];
        _input = forge.util.createBuffer();
        _state = {
            h0: 1732584193,
            h1: 4023233417,
            h2: 2562383102,
            h3: 271733878
        };
        return md;
    };
    md.start();
    md.update = function (msg, encoding) {
        if (encoding === 'utf8') {
            msg = forge.util.encodeUtf8(msg);
        }
        md.messageLength += msg.length;
        md.messageLength64[0] += msg.length / 4294967296 >>> 0;
        md.messageLength64[1] += msg.length >>> 0;
        _input.putBytes(msg);
        _update(_state, _w, _input);
        if (_input.read > 2048 || _input.length() === 0) {
            _input.compact();
        }
        return md;
    };
    md.digest = function () {
        var padBytes = forge.util.createBuffer();
        padBytes.putBytes(_input.bytes());
        padBytes.putBytes(_padding.substr(0, 64 - (md.messageLength64[1] + 8 & 63)));
        padBytes.putInt32Le(md.messageLength64[1] << 3);
        padBytes.putInt32Le(md.messageLength64[0] << 3 | md.messageLength64[0] >>> 28);
        var s2 = {
            h0: _state.h0,
            h1: _state.h1,
            h2: _state.h2,
            h3: _state.h3
        };
        _update(s2, _w, padBytes);
        var rval = forge.util.createBuffer();
        rval.putInt32Le(s2.h0);
        rval.putInt32Le(s2.h1);
        rval.putInt32Le(s2.h2);
        rval.putInt32Le(s2.h3);
        return rval;
    };
    return md;
};
var _padding = null;
var _g = null;
var _r = null;
var _k = null;
var _initialized = false;
function _init() {
    _padding = String.fromCharCode(128);
    _padding += forge.util.fillString(String.fromCharCode(0), 64);
    _g = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        1,
        6,
        11,
        0,
        5,
        10,
        15,
        4,
        9,
        14,
        3,
        8,
        13,
        2,
        7,
        12,
        5,
        8,
        11,
        14,
        1,
        4,
        7,
        10,
        13,
        0,
        3,
        6,
        9,
        12,
        15,
        2,
        0,
        7,
        14,
        5,
        12,
        3,
        10,
        1,
        8,
        15,
        6,
        13,
        4,
        11,
        2,
        9
    ];
    _r = [
        7,
        12,
        17,
        22,
        7,
        12,
        17,
        22,
        7,
        12,
        17,
        22,
        7,
        12,
        17,
        22,
        5,
        9,
        14,
        20,
        5,
        9,
        14,
        20,
        5,
        9,
        14,
        20,
        5,
        9,
        14,
        20,
        4,
        11,
        16,
        23,
        4,
        11,
        16,
        23,
        4,
        11,
        16,
        23,
        4,
        11,
        16,
        23,
        6,
        10,
        15,
        21,
        6,
        10,
        15,
        21,
        6,
        10,
        15,
        21,
        6,
        10,
        15,
        21
    ];
    _k = new Array(64);
    for (var i = 0; i < 64; ++i) {
        _k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);
    }
    _initialized = true;
}
function _update(s, w, bytes) {
    var t, a, b, c, d, f, r, i;
    var len = bytes.length();
    while (len >= 64) {
        a = s.h0;
        b = s.h1;
        c = s.h2;
        d = s.h3;
        for (i = 0; i < 16; ++i) {
            w[i] = bytes.getInt32Le();
            f = d ^ b & (c ^ d);
            t = a + f + _k[i] + w[i];
            r = _r[i];
            a = d;
            d = c;
            c = b;
            b += t << r | t >>> 32 - r;
        }
        for (; i < 32; ++i) {
            f = c ^ d & (b ^ c);
            t = a + f + _k[i] + w[_g[i]];
            r = _r[i];
            a = d;
            d = c;
            c = b;
            b += t << r | t >>> 32 - r;
        }
        for (; i < 48; ++i) {
            f = b ^ c ^ d;
            t = a + f + _k[i] + w[_g[i]];
            r = _r[i];
            a = d;
            d = c;
            c = b;
            b += t << r | t >>> 32 - r;
        }
        for (; i < 64; ++i) {
            f = c ^ (b | ~d);
            t = a + f + _k[i] + w[_g[i]];
            r = _r[i];
            a = d;
            d = c;
            c = b;
            b += t << r | t >>> 32 - r;
        }
        s.h0 = s.h0 + a | 0;
        s.h1 = s.h1 + b | 0;
        s.h2 = s.h2 + c | 0;
        s.h3 = s.h3 + d | 0;
        len -= 64;
    }
}

}(root.forge));


// js/sha1
(function(forge){
var sha1 = forge.sha1 = forge.sha1 || {};
forge.md = forge.md || {};
forge.md.algorithms = forge.md.algorithms || {};
forge.md.sha1 = forge.md.algorithms.sha1 = sha1;
sha1.create = function () {
    if (!_initialized) {
        _init();
    }
    var _state = null;
    var _input = forge.util.createBuffer();
    var _w = new Array(80);
    var md = {
        algorithm: 'sha1',
        blockLength: 64,
        digestLength: 20,
        messageLength: 0,
        messageLength64: [
            0,
            0
        ]
    };
    md.start = function () {
        md.messageLength = 0;
        md.messageLength64 = [
            0,
            0
        ];
        _input = forge.util.createBuffer();
        _state = {
            h0: 1732584193,
            h1: 4023233417,
            h2: 2562383102,
            h3: 271733878,
            h4: 3285377520
        };
        return md;
    };
    md.start();
    md.update = function (msg, encoding) {
        if (encoding === 'utf8') {
            msg = forge.util.encodeUtf8(msg);
        }
        md.messageLength += msg.length;
        md.messageLength64[0] += msg.length / 4294967296 >>> 0;
        md.messageLength64[1] += msg.length >>> 0;
        _input.putBytes(msg);
        _update(_state, _w, _input);
        if (_input.read > 2048 || _input.length() === 0) {
            _input.compact();
        }
        return md;
    };
    md.digest = function () {
        var padBytes = forge.util.createBuffer();
        padBytes.putBytes(_input.bytes());
        padBytes.putBytes(_padding.substr(0, 64 - (md.messageLength64[1] + 8 & 63)));
        padBytes.putInt32(md.messageLength64[0] << 3 | md.messageLength64[0] >>> 28);
        padBytes.putInt32(md.messageLength64[1] << 3);
        var s2 = {
            h0: _state.h0,
            h1: _state.h1,
            h2: _state.h2,
            h3: _state.h3,
            h4: _state.h4
        };
        _update(s2, _w, padBytes);
        var rval = forge.util.createBuffer();
        rval.putInt32(s2.h0);
        rval.putInt32(s2.h1);
        rval.putInt32(s2.h2);
        rval.putInt32(s2.h3);
        rval.putInt32(s2.h4);
        return rval;
    };
    return md;
};
var _padding = null;
var _initialized = false;
function _init() {
    _padding = String.fromCharCode(128);
    _padding += forge.util.fillString(String.fromCharCode(0), 64);
    _initialized = true;
}
function _update(s, w, bytes) {
    var t, a, b, c, d, e, f, i;
    var len = bytes.length();
    while (len >= 64) {
        a = s.h0;
        b = s.h1;
        c = s.h2;
        d = s.h3;
        e = s.h4;
        for (i = 0; i < 16; ++i) {
            t = bytes.getInt32();
            w[i] = t;
            f = d ^ b & (c ^ d);
            t = (a << 5 | a >>> 27) + f + e + 1518500249 + t;
            e = d;
            d = c;
            c = b << 30 | b >>> 2;
            b = a;
            a = t;
        }
        for (; i < 20; ++i) {
            t = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
            t = t << 1 | t >>> 31;
            w[i] = t;
            f = d ^ b & (c ^ d);
            t = (a << 5 | a >>> 27) + f + e + 1518500249 + t;
            e = d;
            d = c;
            c = b << 30 | b >>> 2;
            b = a;
            a = t;
        }
        for (; i < 32; ++i) {
            t = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
            t = t << 1 | t >>> 31;
            w[i] = t;
            f = b ^ c ^ d;
            t = (a << 5 | a >>> 27) + f + e + 1859775393 + t;
            e = d;
            d = c;
            c = b << 30 | b >>> 2;
            b = a;
            a = t;
        }
        for (; i < 40; ++i) {
            t = w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32];
            t = t << 2 | t >>> 30;
            w[i] = t;
            f = b ^ c ^ d;
            t = (a << 5 | a >>> 27) + f + e + 1859775393 + t;
            e = d;
            d = c;
            c = b << 30 | b >>> 2;
            b = a;
            a = t;
        }
        for (; i < 60; ++i) {
            t = w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32];
            t = t << 2 | t >>> 30;
            w[i] = t;
            f = b & c | d & (b ^ c);
            t = (a << 5 | a >>> 27) + f + e + 2400959708 + t;
            e = d;
            d = c;
            c = b << 30 | b >>> 2;
            b = a;
            a = t;
        }
        for (; i < 80; ++i) {
            t = w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32];
            t = t << 2 | t >>> 30;
            w[i] = t;
            f = b ^ c ^ d;
            t = (a << 5 | a >>> 27) + f + e + 3395469782 + t;
            e = d;
            d = c;
            c = b << 30 | b >>> 2;
            b = a;
            a = t;
        }
        s.h0 = s.h0 + a | 0;
        s.h1 = s.h1 + b | 0;
        s.h2 = s.h2 + c | 0;
        s.h3 = s.h3 + d | 0;
        s.h4 = s.h4 + e | 0;
        len -= 64;
    }
}

}(root.forge));


// js/sha256
(function(forge){
var sha256 = forge.sha256 = forge.sha256 || {};
forge.md = forge.md || {};
forge.md.algorithms = forge.md.algorithms || {};
forge.md.sha256 = forge.md.algorithms.sha256 = sha256;
sha256.create = function () {
    if (!_initialized) {
        _init();
    }
    var _state = null;
    var _input = forge.util.createBuffer();
    var _w = new Array(64);
    var md = {
        algorithm: 'sha256',
        blockLength: 64,
        digestLength: 32,
        messageLength: 0,
        messageLength64: [
            0,
            0
        ]
    };
    md.start = function () {
        md.messageLength = 0;
        md.messageLength64 = [
            0,
            0
        ];
        _input = forge.util.createBuffer();
        _state = {
            h0: 1779033703,
            h1: 3144134277,
            h2: 1013904242,
            h3: 2773480762,
            h4: 1359893119,
            h5: 2600822924,
            h6: 528734635,
            h7: 1541459225
        };
        return md;
    };
    md.start();
    md.update = function (msg, encoding) {
        if (encoding === 'utf8') {
            msg = forge.util.encodeUtf8(msg);
        }
        md.messageLength += msg.length;
        md.messageLength64[0] += msg.length / 4294967296 >>> 0;
        md.messageLength64[1] += msg.length >>> 0;
        _input.putBytes(msg);
        _update(_state, _w, _input);
        if (_input.read > 2048 || _input.length() === 0) {
            _input.compact();
        }
        return md;
    };
    md.digest = function () {
        var padBytes = forge.util.createBuffer();
        padBytes.putBytes(_input.bytes());
        padBytes.putBytes(_padding.substr(0, 64 - (md.messageLength64[1] + 8 & 63)));
        padBytes.putInt32(md.messageLength64[0] << 3 | md.messageLength64[0] >>> 28);
        padBytes.putInt32(md.messageLength64[1] << 3);
        var s2 = {
            h0: _state.h0,
            h1: _state.h1,
            h2: _state.h2,
            h3: _state.h3,
            h4: _state.h4,
            h5: _state.h5,
            h6: _state.h6,
            h7: _state.h7
        };
        _update(s2, _w, padBytes);
        var rval = forge.util.createBuffer();
        rval.putInt32(s2.h0);
        rval.putInt32(s2.h1);
        rval.putInt32(s2.h2);
        rval.putInt32(s2.h3);
        rval.putInt32(s2.h4);
        rval.putInt32(s2.h5);
        rval.putInt32(s2.h6);
        rval.putInt32(s2.h7);
        return rval;
    };
    return md;
};
var _padding = null;
var _initialized = false;
var _k = null;
function _init() {
    _padding = String.fromCharCode(128);
    _padding += forge.util.fillString(String.fromCharCode(0), 64);
    _k = [
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
    ];
    _initialized = true;
}
function _update(s, w, bytes) {
    var t1, t2, s0, s1, ch, maj, i, a, b, c, d, e, f, g, h;
    var len = bytes.length();
    while (len >= 64) {
        for (i = 0; i < 16; ++i) {
            w[i] = bytes.getInt32();
        }
        for (; i < 64; ++i) {
            t1 = w[i - 2];
            t1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10;
            t2 = w[i - 15];
            t2 = (t2 >>> 7 | t2 << 25) ^ (t2 >>> 18 | t2 << 14) ^ t2 >>> 3;
            w[i] = t1 + w[i - 7] + t2 + w[i - 16] | 0;
        }
        a = s.h0;
        b = s.h1;
        c = s.h2;
        d = s.h3;
        e = s.h4;
        f = s.h5;
        g = s.h6;
        h = s.h7;
        for (i = 0; i < 64; ++i) {
            s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
            ch = g ^ e & (f ^ g);
            s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
            maj = a & b | c & (a ^ b);
            t1 = h + s1 + ch + _k[i] + w[i];
            t2 = s0 + maj;
            h = g;
            g = f;
            f = e;
            e = d + t1 | 0;
            d = c;
            c = b;
            b = a;
            a = t1 + t2 | 0;
        }
        s.h0 = s.h0 + a | 0;
        s.h1 = s.h1 + b | 0;
        s.h2 = s.h2 + c | 0;
        s.h3 = s.h3 + d | 0;
        s.h4 = s.h4 + e | 0;
        s.h5 = s.h5 + f | 0;
        s.h6 = s.h6 + g | 0;
        s.h7 = s.h7 + h | 0;
        len -= 64;
    }
}

}(root.forge));


// js/sha512
(function(forge){
var sha512 = forge.sha512 = forge.sha512 || {};
forge.md = forge.md || {};
forge.md.algorithms = forge.md.algorithms || {};
forge.md.sha512 = forge.md.algorithms.sha512 = sha512;
var sha384 = forge.sha384 = forge.sha512.sha384 = forge.sha512.sha384 || {};
sha384.create = function () {
    return sha512.create('SHA-384');
};
forge.md.sha384 = forge.md.algorithms.sha384 = sha384;
forge.sha512.sha256 = forge.sha512.sha256 || {
    create: function () {
        return sha512.create('SHA-512/256');
    }
};
forge.md['sha512/256'] = forge.md.algorithms['sha512/256'] = forge.sha512.sha256;
forge.sha512.sha224 = forge.sha512.sha224 || {
    create: function () {
        return sha512.create('SHA-512/224');
    }
};
forge.md['sha512/224'] = forge.md.algorithms['sha512/224'] = forge.sha512.sha224;
sha512.create = function (algorithm) {
    if (!_initialized) {
        _init();
    }
    if (typeof algorithm === 'undefined') {
        algorithm = 'SHA-512';
    }
    if (!(algorithm in _states)) {
        throw new Error('Invalid SHA-512 algorithm: ' + algorithm);
    }
    var _state = _states[algorithm];
    var _h = null;
    var _input = forge.util.createBuffer();
    var _w = new Array(80);
    for (var wi = 0; wi < 80; ++wi) {
        _w[wi] = new Array(2);
    }
    var md = {
        algorithm: algorithm.replace('-', '').toLowerCase(),
        blockLength: 128,
        digestLength: 64,
        messageLength: 0,
        messageLength128: [
            0,
            0,
            0,
            0
        ]
    };
    md.start = function () {
        md.messageLength = 0;
        md.messageLength128 = [
            0,
            0,
            0,
            0
        ];
        _input = forge.util.createBuffer();
        _h = new Array(_state.length);
        for (var i = 0; i < _state.length; ++i) {
            _h[i] = _state[i].slice(0);
        }
        return md;
    };
    md.start();
    md.update = function (msg, encoding) {
        if (encoding === 'utf8') {
            msg = forge.util.encodeUtf8(msg);
        }
        md.messageLength += msg.length;
        var len = msg.length;
        len = [
            len / 4294967296 >>> 0,
            len >>> 0
        ];
        for (var i = 3; i >= 0; --i) {
            md.messageLength128[i] += len[1];
            len[1] = len[0] + (md.messageLength128[i] / 4294967296 >>> 0);
            md.messageLength128[i] = md.messageLength128[i] >>> 0;
            len[0] = len[1] / 4294967296 >>> 0;
        }
        _input.putBytes(msg);
        _update(_h, _w, _input);
        if (_input.read > 2048 || _input.length() === 0) {
            _input.compact();
        }
        return md;
    };
    md.digest = function () {
        var padBytes = forge.util.createBuffer();
        padBytes.putBytes(_input.bytes());
        padBytes.putBytes(_padding.substr(0, 128 - (md.messageLength128[3] + 16 & 127)));
        var bitLength = [];
        for (var i = 0; i < 3; ++i) {
            bitLength[i] = md.messageLength128[i] << 3 | md.messageLength128[i - 1] >>> 28;
        }
        bitLength[3] = md.messageLength128[3] << 3;
        padBytes.putInt32(bitLength[0]);
        padBytes.putInt32(bitLength[1]);
        padBytes.putInt32(bitLength[2]);
        padBytes.putInt32(bitLength[3]);
        var h = new Array(_h.length);
        for (var i = 0; i < _h.length; ++i) {
            h[i] = _h[i].slice(0);
        }
        _update(h, _w, padBytes);
        var rval = forge.util.createBuffer();
        var hlen;
        if (algorithm === 'SHA-512') {
            hlen = h.length;
        } else if (algorithm === 'SHA-384') {
            hlen = h.length - 2;
        } else {
            hlen = h.length - 4;
        }
        for (var i = 0; i < hlen; ++i) {
            rval.putInt32(h[i][0]);
            if (i !== hlen - 1 || algorithm !== 'SHA-512/224') {
                rval.putInt32(h[i][1]);
            }
        }
        return rval;
    };
    return md;
};
var _padding = null;
var _initialized = false;
var _k = null;
var _states = null;
function _init() {
    _padding = String.fromCharCode(128);
    _padding += forge.util.fillString(String.fromCharCode(0), 128);
    _k = [
        [
            1116352408,
            3609767458
        ],
        [
            1899447441,
            602891725
        ],
        [
            3049323471,
            3964484399
        ],
        [
            3921009573,
            2173295548
        ],
        [
            961987163,
            4081628472
        ],
        [
            1508970993,
            3053834265
        ],
        [
            2453635748,
            2937671579
        ],
        [
            2870763221,
            3664609560
        ],
        [
            3624381080,
            2734883394
        ],
        [
            310598401,
            1164996542
        ],
        [
            607225278,
            1323610764
        ],
        [
            1426881987,
            3590304994
        ],
        [
            1925078388,
            4068182383
        ],
        [
            2162078206,
            991336113
        ],
        [
            2614888103,
            633803317
        ],
        [
            3248222580,
            3479774868
        ],
        [
            3835390401,
            2666613458
        ],
        [
            4022224774,
            944711139
        ],
        [
            264347078,
            2341262773
        ],
        [
            604807628,
            2007800933
        ],
        [
            770255983,
            1495990901
        ],
        [
            1249150122,
            1856431235
        ],
        [
            1555081692,
            3175218132
        ],
        [
            1996064986,
            2198950837
        ],
        [
            2554220882,
            3999719339
        ],
        [
            2821834349,
            766784016
        ],
        [
            2952996808,
            2566594879
        ],
        [
            3210313671,
            3203337956
        ],
        [
            3336571891,
            1034457026
        ],
        [
            3584528711,
            2466948901
        ],
        [
            113926993,
            3758326383
        ],
        [
            338241895,
            168717936
        ],
        [
            666307205,
            1188179964
        ],
        [
            773529912,
            1546045734
        ],
        [
            1294757372,
            1522805485
        ],
        [
            1396182291,
            2643833823
        ],
        [
            1695183700,
            2343527390
        ],
        [
            1986661051,
            1014477480
        ],
        [
            2177026350,
            1206759142
        ],
        [
            2456956037,
            344077627
        ],
        [
            2730485921,
            1290863460
        ],
        [
            2820302411,
            3158454273
        ],
        [
            3259730800,
            3505952657
        ],
        [
            3345764771,
            106217008
        ],
        [
            3516065817,
            3606008344
        ],
        [
            3600352804,
            1432725776
        ],
        [
            4094571909,
            1467031594
        ],
        [
            275423344,
            851169720
        ],
        [
            430227734,
            3100823752
        ],
        [
            506948616,
            1363258195
        ],
        [
            659060556,
            3750685593
        ],
        [
            883997877,
            3785050280
        ],
        [
            958139571,
            3318307427
        ],
        [
            1322822218,
            3812723403
        ],
        [
            1537002063,
            2003034995
        ],
        [
            1747873779,
            3602036899
        ],
        [
            1955562222,
            1575990012
        ],
        [
            2024104815,
            1125592928
        ],
        [
            2227730452,
            2716904306
        ],
        [
            2361852424,
            442776044
        ],
        [
            2428436474,
            593698344
        ],
        [
            2756734187,
            3733110249
        ],
        [
            3204031479,
            2999351573
        ],
        [
            3329325298,
            3815920427
        ],
        [
            3391569614,
            3928383900
        ],
        [
            3515267271,
            566280711
        ],
        [
            3940187606,
            3454069534
        ],
        [
            4118630271,
            4000239992
        ],
        [
            116418474,
            1914138554
        ],
        [
            174292421,
            2731055270
        ],
        [
            289380356,
            3203993006
        ],
        [
            460393269,
            320620315
        ],
        [
            685471733,
            587496836
        ],
        [
            852142971,
            1086792851
        ],
        [
            1017036298,
            365543100
        ],
        [
            1126000580,
            2618297676
        ],
        [
            1288033470,
            3409855158
        ],
        [
            1501505948,
            4234509866
        ],
        [
            1607167915,
            987167468
        ],
        [
            1816402316,
            1246189591
        ]
    ];
    _states = {};
    _states['SHA-512'] = [
        [
            1779033703,
            4089235720
        ],
        [
            3144134277,
            2227873595
        ],
        [
            1013904242,
            4271175723
        ],
        [
            2773480762,
            1595750129
        ],
        [
            1359893119,
            2917565137
        ],
        [
            2600822924,
            725511199
        ],
        [
            528734635,
            4215389547
        ],
        [
            1541459225,
            327033209
        ]
    ];
    _states['SHA-384'] = [
        [
            3418070365,
            3238371032
        ],
        [
            1654270250,
            914150663
        ],
        [
            2438529370,
            812702999
        ],
        [
            355462360,
            4144912697
        ],
        [
            1731405415,
            4290775857
        ],
        [
            2394180231,
            1750603025
        ],
        [
            3675008525,
            1694076839
        ],
        [
            1203062813,
            3204075428
        ]
    ];
    _states['SHA-512/256'] = [
        [
            573645204,
            4230739756
        ],
        [
            2673172387,
            3360449730
        ],
        [
            596883563,
            1867755857
        ],
        [
            2520282905,
            1497426621
        ],
        [
            2519219938,
            2827943907
        ],
        [
            3193839141,
            1401305490
        ],
        [
            721525244,
            746961066
        ],
        [
            246885852,
            2177182882
        ]
    ];
    _states['SHA-512/224'] = [
        [
            2352822216,
            424955298
        ],
        [
            1944164710,
            2312950998
        ],
        [
            502970286,
            855612546
        ],
        [
            1738396948,
            1479516111
        ],
        [
            258812777,
            2077511080
        ],
        [
            2011393907,
            79989058
        ],
        [
            1067287976,
            1780299464
        ],
        [
            286451373,
            2446758561
        ]
    ];
    _initialized = true;
}
function _update(s, w, bytes) {
    var t1_hi, t1_lo;
    var t2_hi, t2_lo;
    var s0_hi, s0_lo;
    var s1_hi, s1_lo;
    var ch_hi, ch_lo;
    var maj_hi, maj_lo;
    var a_hi, a_lo;
    var b_hi, b_lo;
    var c_hi, c_lo;
    var d_hi, d_lo;
    var e_hi, e_lo;
    var f_hi, f_lo;
    var g_hi, g_lo;
    var h_hi, h_lo;
    var i, hi, lo, w2, w7, w15, w16;
    var len = bytes.length();
    while (len >= 128) {
        for (i = 0; i < 16; ++i) {
            w[i][0] = bytes.getInt32() >>> 0;
            w[i][1] = bytes.getInt32() >>> 0;
        }
        for (; i < 80; ++i) {
            w2 = w[i - 2];
            hi = w2[0];
            lo = w2[1];
            t1_hi = ((hi >>> 19 | lo << 13) ^ (lo >>> 29 | hi << 3) ^ hi >>> 6) >>> 0;
            t1_lo = ((hi << 13 | lo >>> 19) ^ (lo << 3 | hi >>> 29) ^ (hi << 26 | lo >>> 6)) >>> 0;
            w15 = w[i - 15];
            hi = w15[0];
            lo = w15[1];
            t2_hi = ((hi >>> 1 | lo << 31) ^ (hi >>> 8 | lo << 24) ^ hi >>> 7) >>> 0;
            t2_lo = ((hi << 31 | lo >>> 1) ^ (hi << 24 | lo >>> 8) ^ (hi << 25 | lo >>> 7)) >>> 0;
            w7 = w[i - 7];
            w16 = w[i - 16];
            lo = t1_lo + w7[1] + t2_lo + w16[1];
            w[i][0] = t1_hi + w7[0] + t2_hi + w16[0] + (lo / 4294967296 >>> 0) >>> 0;
            w[i][1] = lo >>> 0;
        }
        a_hi = s[0][0];
        a_lo = s[0][1];
        b_hi = s[1][0];
        b_lo = s[1][1];
        c_hi = s[2][0];
        c_lo = s[2][1];
        d_hi = s[3][0];
        d_lo = s[3][1];
        e_hi = s[4][0];
        e_lo = s[4][1];
        f_hi = s[5][0];
        f_lo = s[5][1];
        g_hi = s[6][0];
        g_lo = s[6][1];
        h_hi = s[7][0];
        h_lo = s[7][1];
        for (i = 0; i < 80; ++i) {
            s1_hi = ((e_hi >>> 14 | e_lo << 18) ^ (e_hi >>> 18 | e_lo << 14) ^ (e_lo >>> 9 | e_hi << 23)) >>> 0;
            s1_lo = ((e_hi << 18 | e_lo >>> 14) ^ (e_hi << 14 | e_lo >>> 18) ^ (e_lo << 23 | e_hi >>> 9)) >>> 0;
            ch_hi = (g_hi ^ e_hi & (f_hi ^ g_hi)) >>> 0;
            ch_lo = (g_lo ^ e_lo & (f_lo ^ g_lo)) >>> 0;
            s0_hi = ((a_hi >>> 28 | a_lo << 4) ^ (a_lo >>> 2 | a_hi << 30) ^ (a_lo >>> 7 | a_hi << 25)) >>> 0;
            s0_lo = ((a_hi << 4 | a_lo >>> 28) ^ (a_lo << 30 | a_hi >>> 2) ^ (a_lo << 25 | a_hi >>> 7)) >>> 0;
            maj_hi = (a_hi & b_hi | c_hi & (a_hi ^ b_hi)) >>> 0;
            maj_lo = (a_lo & b_lo | c_lo & (a_lo ^ b_lo)) >>> 0;
            lo = h_lo + s1_lo + ch_lo + _k[i][1] + w[i][1];
            t1_hi = h_hi + s1_hi + ch_hi + _k[i][0] + w[i][0] + (lo / 4294967296 >>> 0) >>> 0;
            t1_lo = lo >>> 0;
            lo = s0_lo + maj_lo;
            t2_hi = s0_hi + maj_hi + (lo / 4294967296 >>> 0) >>> 0;
            t2_lo = lo >>> 0;
            h_hi = g_hi;
            h_lo = g_lo;
            g_hi = f_hi;
            g_lo = f_lo;
            f_hi = e_hi;
            f_lo = e_lo;
            lo = d_lo + t1_lo;
            e_hi = d_hi + t1_hi + (lo / 4294967296 >>> 0) >>> 0;
            e_lo = lo >>> 0;
            d_hi = c_hi;
            d_lo = c_lo;
            c_hi = b_hi;
            c_lo = b_lo;
            b_hi = a_hi;
            b_lo = a_lo;
            lo = t1_lo + t2_lo;
            a_hi = t1_hi + t2_hi + (lo / 4294967296 >>> 0) >>> 0;
            a_lo = lo >>> 0;
        }
        lo = s[0][1] + a_lo;
        s[0][0] = s[0][0] + a_hi + (lo / 4294967296 >>> 0) >>> 0;
        s[0][1] = lo >>> 0;
        lo = s[1][1] + b_lo;
        s[1][0] = s[1][0] + b_hi + (lo / 4294967296 >>> 0) >>> 0;
        s[1][1] = lo >>> 0;
        lo = s[2][1] + c_lo;
        s[2][0] = s[2][0] + c_hi + (lo / 4294967296 >>> 0) >>> 0;
        s[2][1] = lo >>> 0;
        lo = s[3][1] + d_lo;
        s[3][0] = s[3][0] + d_hi + (lo / 4294967296 >>> 0) >>> 0;
        s[3][1] = lo >>> 0;
        lo = s[4][1] + e_lo;
        s[4][0] = s[4][0] + e_hi + (lo / 4294967296 >>> 0) >>> 0;
        s[4][1] = lo >>> 0;
        lo = s[5][1] + f_lo;
        s[5][0] = s[5][0] + f_hi + (lo / 4294967296 >>> 0) >>> 0;
        s[5][1] = lo >>> 0;
        lo = s[6][1] + g_lo;
        s[6][0] = s[6][0] + g_hi + (lo / 4294967296 >>> 0) >>> 0;
        s[6][1] = lo >>> 0;
        lo = s[7][1] + h_lo;
        s[7][0] = s[7][0] + h_hi + (lo / 4294967296 >>> 0) >>> 0;
        s[7][1] = lo >>> 0;
        len -= 128;
    }
}

}(root.forge));


// js/md
(function(forge){
forge.md = forge.md || {};
forge.md.algorithms = {
    md5: forge.md5,
    sha1: forge.sha1,
    sha256: forge.sha256
};
forge.md.md5 = forge.md5;
forge.md.sha1 = forge.sha1;
forge.md.sha256 = forge.sha256;

}(root.forge));


// js/hmac
(function(forge){
var hmac = forge.hmac = forge.hmac || {};
hmac.create = function () {
    var _key = null;
    var _md = null;
    var _ipadding = null;
    var _opadding = null;
    var ctx = {};
    ctx.start = function (md, key) {
        if (md !== null) {
            if (typeof md === 'string') {
                md = md.toLowerCase();
                if (md in forge.md.algorithms) {
                    _md = forge.md.algorithms[md].create();
                } else {
                    throw new Error('Unknown hash algorithm "' + md + '"');
                }
            } else {
                _md = md;
            }
        }
        if (key === null) {
            key = _key;
        } else {
            if (typeof key === 'string') {
                key = forge.util.createBuffer(key);
            } else if (forge.util.isArray(key)) {
                var tmp = key;
                key = forge.util.createBuffer();
                for (var i = 0; i < tmp.length; ++i) {
                    key.putByte(tmp[i]);
                }
            }
            var keylen = key.length();
            if (keylen > _md.blockLength) {
                _md.start();
                _md.update(key.bytes());
                key = _md.digest();
            }
            _ipadding = forge.util.createBuffer();
            _opadding = forge.util.createBuffer();
            keylen = key.length();
            for (var i = 0; i < keylen; ++i) {
                var tmp = key.at(i);
                _ipadding.putByte(54 ^ tmp);
                _opadding.putByte(92 ^ tmp);
            }
            if (keylen < _md.blockLength) {
                var tmp = _md.blockLength - keylen;
                for (var i = 0; i < tmp; ++i) {
                    _ipadding.putByte(54);
                    _opadding.putByte(92);
                }
            }
            _key = key;
            _ipadding = _ipadding.bytes();
            _opadding = _opadding.bytes();
        }
        _md.start();
        _md.update(_ipadding);
    };
    ctx.update = function (bytes) {
        _md.update(bytes);
    };
    ctx.getMac = function () {
        var inner = _md.digest().bytes();
        _md.start();
        _md.update(_opadding);
        _md.update(inner);
        return _md.digest();
    };
    ctx.digest = ctx.getMac;
    return ctx;
};

}(root.forge));


angular.module('forge', ['ng']).factory('forge', function(){
return root.forge;
});
}(this));
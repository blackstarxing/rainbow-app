var Endian = (function () {
    function Endian() {
    }
    Endian.LITTLE_ENDIAN = "littleEndian";
    Endian.BIG_ENDIAN = "bigEndian";
    return Endian;
})();
window.Endian = Endian;
var ByteArray = (function () {
    /**
     * @version Egret 2.4
     * @platform Web,Native
     */
    function ByteArray(buffer) {
        /**
         * @private
         */
        this.BUFFER_EXT_SIZE = 0; //Buffer expansion size
        /**
         * @private
         */
        this.EOF_byte = -1;
        /**
         * @private
         */
        this.EOF_code_point = -1;
        this._setArrayBuffer(buffer || new ArrayBuffer(this.BUFFER_EXT_SIZE));
        this.endian = Endian.BIG_ENDIAN;
    }
    /**
     * @private
     * @param buffer
     */
    ByteArray.prototype._setArrayBuffer = function (buffer) {
        this.write_position = buffer.byteLength;
        this.data = new DataView(buffer);
        this._position = 0;
    };
    /**
     * @deprecated
     * @version Egret 2.4
     * @platform Web,Native
     */
    ByteArray.prototype.setArrayBuffer = function (buffer) {
    };
    Object.defineProperty(ByteArray.prototype, "buffer", {
        get: function () {
            return this.data.buffer;
        },
        /**
         * @private
         */
        set: function (value) {
            this.data = new DataView(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ByteArray.prototype, "dataView", {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        get: function () {
            return this.data;
        },
        /**
         * @private
         */
        set: function (value) {
            this.data = value;
            this.write_position = value.byteLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ByteArray.prototype, "bufferOffset", {
        /**
         * @private
         */
        get: function () {
            return this.data.byteOffset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ByteArray.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (value) {
            //if (this._position < value) {
            //    if (!this.validate(value - this._position)) {
            //        return;
            //    }
            //}
            this._position = value;
            this.write_position = value > this.write_position ? value : this.write_position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ByteArray.prototype, "length", {
        get: function () {
            return this.write_position;
        },
        set: function (value) {
            this.write_position = value;
            var tmp = new Uint8Array(new ArrayBuffer(value));
            var byteLength = this.data.buffer.byteLength;
            if (byteLength > value) {
                this._position = value;
            }
            var length = Math.min(byteLength, value);
            tmp.set(new Uint8Array(this.data.buffer, 0, length));
            this.buffer = tmp.buffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ByteArray.prototype, "bytesAvailable", {
        get: function () {
            return this.data.byteLength - this._position;
        },
        enumerable: true,
        configurable: true
    });
    ByteArray.prototype.clear = function () {
        this._setArrayBuffer(new ArrayBuffer(this.BUFFER_EXT_SIZE));
    };
    ByteArray.prototype.readBoolean = function () {
        if (!this.validate(ByteArray.SIZE_OF_BOOLEAN))
            return null;
        return this.data.getUint8(this.position++) != 0;
    };
    ByteArray.prototype.readByte = function () {
        if (!this.validate(ByteArray.SIZE_OF_INT8))
            return null;
        return this.data.getInt8(this.position++);
    };
    ByteArray.prototype.readBytes = function (bytes, offset, length) {
        if (offset === void 0) { offset = 0; }
        if (length === void 0) { length = 0; }
        if (length == 0) {
            length = this.bytesAvailable;
        }
        else if (!this.validate(length)) {
            //此处有修改
            // return null;
        }
        if (bytes) {
            bytes.validateBuffer(length);
        }
        else {
            bytes = new ByteArray(new ArrayBuffer(length));
        }
        //This method is expensive
        for (var i = offset; i < length; i++) {
            // console.log(i-offset,i,length);
            bytes.data.setUint8(i-offset, this.data.getUint8(i));
        }
    };
    ByteArray.prototype.readDouble = function () {
        if (!this.validate(ByteArray.SIZE_OF_FLOAT64))
            return null;
        var value = this.data.getFloat64(this.position, this.endian == Endian.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_FLOAT64;
        return value;
    };
    ByteArray.prototype.readFloat = function () {
        if (!this.validate(ByteArray.SIZE_OF_FLOAT32))
            return null;
        var value = this.data.getFloat32(this.position, this.endian == Endian.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_FLOAT32;
        return value;
    };
    ByteArray.prototype.readInt = function () {
        if (!this.validate(ByteArray.SIZE_OF_INT32))
            return null;
        var value = this.data.getInt32(this.position, this.endian == Endian.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_INT32;
        return value;
    };
    ByteArray.prototype.readShort = function () {
        if (!this.validate(ByteArray.SIZE_OF_INT16))
            return null;
        var value = this.data.getInt16(this.position, this.endian == Endian.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_INT16;
        return value;
    };
    ByteArray.prototype.readUnsignedByte = function () {
        if (!this.validate(ByteArray.SIZE_OF_UINT8))
            return null;
        return this.data.getUint8(this.position++);
    };
    ByteArray.prototype.readUnsignedInt = function () {
        if (!this.validate(ByteArray.SIZE_OF_UINT32))
            return null;
        var value = this.data.getUint32(this.position, this.endian == Endian.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_UINT32;
        return value;
    };
    ByteArray.prototype.readUnsignedShort = function () {
        if (!this.validate(ByteArray.SIZE_OF_UINT16))
            return null;
        var value = this.data.getUint16(this.position, this.endian == Endian.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_UINT16;
        return value;
    };
    ByteArray.prototype.readUTF = function () {
        if (!this.validate(ByteArray.SIZE_OF_UINT16))
            return null;
        var length = this.data.getUint16(this.position, this.endian == Endian.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_UINT16;
        if (length > 0) {
            return this.readUTFBytes(length);
        }
        else {
            return "";
        }
    };
    ByteArray.prototype.readUTFBytes = function (length) {
        if (!this.validate(length))
            return null;
        var bytes = new Uint8Array(this.buffer, this.bufferOffset + this.position, length);
        this.position += length;
        /*var bytes: Uint8Array = new Uint8Array(new ArrayBuffer(length));
         for (var i = 0; i < length; i++) {
         bytes[i] = this.data.getUint8(this.position++);
         }*/
        return this.decodeUTF8(bytes);
    };
    ByteArray.prototype.writeBoolean = function (value) {
        this.validateBuffer(ByteArray.SIZE_OF_BOOLEAN);
        this.data.setUint8(this.position++, value ? 1 : 0);
    };
    ByteArray.prototype.writeByte = function (value) {
        this.validateBuffer(ByteArray.SIZE_OF_INT8);
        this.data.setInt8(this.position++, value);
    };
    ByteArray.prototype.writeBytes = function (bytes, offset, length) {
        if (offset === void 0) { offset = 0; }
        if (length === void 0) { length = 0; }
        var writeLength;
        if (offset < 0) {
            return;
        }
        if (length < 0) {
            return;
        }
        else if (length == 0) {
            writeLength = bytes.length - offset;
        }
        else {
            writeLength = Math.min(bytes.length - offset, length);
        }
        if (writeLength > 0) {
            this.validateBuffer(writeLength);
            var tmp_data = new DataView(bytes.buffer);
            for (var i = offset; i < writeLength + offset; i++) {
                this.data.setUint8(this.position++, tmp_data.getUint8(i));
            }
        }
    };
    ByteArray.prototype.writeDouble = function (value) {
        this.validateBuffer(ByteArray.SIZE_OF_FLOAT64);
        this.data.setFloat64(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_FLOAT64;
    };
    ByteArray.prototype.writeFloat = function (value) {
        this.validateBuffer(ByteArray.SIZE_OF_FLOAT32);
        this.data.setFloat32(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_FLOAT32;
    };
    ByteArray.prototype.writeInt = function (value) {
        this.validateBuffer(ByteArray.SIZE_OF_INT32);
        this.data.setInt32(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_INT32;
    };
    ByteArray.prototype.writeShort = function (value) {
        this.validateBuffer(ByteArray.SIZE_OF_INT16);
        this.data.setInt16(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_INT16;
    };
    ByteArray.prototype.writeUnsignedInt = function (value) {
        this.validateBuffer(ByteArray.SIZE_OF_UINT32);
        this.data.setUint32(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_UINT32;
    };
    ByteArray.prototype.writeUTF = function (value) {
        var utf8bytes = this.encodeUTF8(value);
        var length = utf8bytes.length;
        this.validateBuffer(ByteArray.SIZE_OF_UINT16 + length);
        this.data.setUint16(this.position, length, this.endian == Endian.LITTLE_ENDIAN);
        this.position += ByteArray.SIZE_OF_UINT16;
        this._writeUint8Array(utf8bytes, false);
    };
    ByteArray.prototype.writeUTFBytes = function (value) {
        this._writeUint8Array(this.encodeUTF8(value));
    };
    /**
     *
     * @returns
     * @version Egret 2.4
     * @platform Web,Native
     */
    ByteArray.prototype.toString = function () {
        return "[ByteArray] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
    };
    /**
     * @private
     * 将 Uint8Array 写入字节流
     * @param bytes 要写入的Uint8Array
     * @param validateBuffer
     */
    ByteArray.prototype._writeUint8Array = function (bytes, validateBuffer) {
        if (validateBuffer === void 0) { validateBuffer = true; }
        if (validateBuffer) {
            this.validateBuffer(this.position + bytes.length);
        }
        for (var i = 0; i < bytes.length; i++) {
            this.data.setUint8(this.position++, bytes[i]);
        }
    };
    /**
     * @param len
     * @returns
     * @version Egret 2.4
     * @platform Web,Native
     * @private
     */
    ByteArray.prototype.validate = function (len) {
        //len += this.data.byteOffset;
        if (this.data.byteLength > 0 && this._position + len <= this.data.byteLength) {
            return true;
        }
        else {
        }
    };
    /**********************/
    /*  PRIVATE METHODS   */
    /**********************/
    /**
     * @private
     * @param len
     * @param needReplace
     */
    ByteArray.prototype.validateBuffer = function (len, needReplace) {
        if (needReplace === void 0) { needReplace = false; }
        this.write_position = len > this.write_position ? len : this.write_position;
        len += this._position;
        if (this.data.byteLength < len || needReplace) {
            var tmp = new Uint8Array(new ArrayBuffer(len + this.BUFFER_EXT_SIZE));
            var length = Math.min(this.data.buffer.byteLength, len + this.BUFFER_EXT_SIZE);
            tmp.set(new Uint8Array(this.data.buffer, 0, length));
            this.buffer = tmp.buffer;
        }
    };
    /**
     * @private
     * UTF-8 Encoding/Decoding
     */
    ByteArray.prototype.encodeUTF8 = function (str) {
        var pos = 0;
        var codePoints = this.stringToCodePoints(str);
        var outputBytes = [];
        while (codePoints.length > pos) {
            var code_point = codePoints[pos++];
            if (this.inRange(code_point, 0xD800, 0xDFFF)) {
                this.encoderError(code_point);
            }
            else if (this.inRange(code_point, 0x0000, 0x007f)) {
                outputBytes.push(code_point);
            }
            else {
                var count, offset;
                if (this.inRange(code_point, 0x0080, 0x07FF)) {
                    count = 1;
                    offset = 0xC0;
                }
                else if (this.inRange(code_point, 0x0800, 0xFFFF)) {
                    count = 2;
                    offset = 0xE0;
                }
                else if (this.inRange(code_point, 0x10000, 0x10FFFF)) {
                    count = 3;
                    offset = 0xF0;
                }
                outputBytes.push(this.div(code_point, Math.pow(64, count)) + offset);
                while (count > 0) {
                    var temp = this.div(code_point, Math.pow(64, count - 1));
                    outputBytes.push(0x80 + (temp % 64));
                    count -= 1;
                }
            }
        }
        return new Uint8Array(outputBytes);
    };
    /**
     * @private
     *
     * @param data
     * @returns
     */
    ByteArray.prototype.decodeUTF8 = function (data) {
        var fatal = false;
        var pos = 0;
        var result = "";
        var code_point;
        var utf8_code_point = 0;
        var utf8_bytes_needed = 0;
        var utf8_bytes_seen = 0;
        var utf8_lower_boundary = 0;
        while (data.length > pos) {
            var _byte = data[pos++];
            if (_byte == this.EOF_byte) {
                if (utf8_bytes_needed != 0) {
                    code_point = this.decoderError(fatal);
                }
                else {
                    code_point = this.EOF_code_point;
                }
            }
            else {
                if (utf8_bytes_needed == 0) {
                    if (this.inRange(_byte, 0x00, 0x7F)) {
                        code_point = _byte;
                    }
                    else {
                        if (this.inRange(_byte, 0xC2, 0xDF)) {
                            utf8_bytes_needed = 1;
                            utf8_lower_boundary = 0x80;
                            utf8_code_point = _byte - 0xC0;
                        }
                        else if (this.inRange(_byte, 0xE0, 0xEF)) {
                            utf8_bytes_needed = 2;
                            utf8_lower_boundary = 0x800;
                            utf8_code_point = _byte - 0xE0;
                        }
                        else if (this.inRange(_byte, 0xF0, 0xF4)) {
                            utf8_bytes_needed = 3;
                            utf8_lower_boundary = 0x10000;
                            utf8_code_point = _byte - 0xF0;
                        }
                        else {
                            this.decoderError(fatal);
                        }
                        utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                        code_point = null;
                    }
                }
                else if (!this.inRange(_byte, 0x80, 0xBF)) {
                    utf8_code_point = 0;
                    utf8_bytes_needed = 0;
                    utf8_bytes_seen = 0;
                    utf8_lower_boundary = 0;
                    pos--;
                    code_point = this.decoderError(fatal, _byte);
                }
                else {
                    utf8_bytes_seen += 1;
                    utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
                    if (utf8_bytes_seen !== utf8_bytes_needed) {
                        code_point = null;
                    }
                    else {
                        var cp = utf8_code_point;
                        var lower_boundary = utf8_lower_boundary;
                        utf8_code_point = 0;
                        utf8_bytes_needed = 0;
                        utf8_bytes_seen = 0;
                        utf8_lower_boundary = 0;
                        if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                            code_point = cp;
                        }
                        else {
                            code_point = this.decoderError(fatal, _byte);
                        }
                    }
                }
            }
            //Decode string
            if (code_point !== null && code_point !== this.EOF_code_point) {
                if (code_point <= 0xFFFF) {
                    if (code_point > 0)
                        result += String.fromCharCode(code_point);
                }
                else {
                    code_point -= 0x10000;
                    result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                    result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                }
            }
        }
        return result;
    };
    /**
     * @private
     *
     * @param code_point
     */
    ByteArray.prototype.encoderError = function (code_point) {
        //egret.$error(1026, code_point);
    };
    /**
     * @private
     *
     * @param fatal
     * @param opt_code_point
     * @returns
     */
    ByteArray.prototype.decoderError = function (fatal, opt_code_point) {
        if (fatal) {
        }
        return opt_code_point || 0xFFFD;
    };
    /**
     * @private
     *
     * @param a
     * @param min
     * @param max
     */
    ByteArray.prototype.inRange = function (a, min, max) {
        return min <= a && a <= max;
    };
    /**
     * @private
     *
     * @param n
     * @param d
     */
    ByteArray.prototype.div = function (n, d) {
        return Math.floor(n / d);
    };
    /**
     * @private
     *
     * @param string
     */
    ByteArray.prototype.stringToCodePoints = function (string) {
        /** @type {Array.<number>} */
        var cps = [];
        // Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
        var i = 0, n = string.length;
        while (i < string.length) {
            var c = string.charCodeAt(i);
            if (!this.inRange(c, 0xD800, 0xDFFF)) {
                cps.push(c);
            }
            else if (this.inRange(c, 0xDC00, 0xDFFF)) {
                cps.push(0xFFFD);
            }
            else {
                if (i == n - 1) {
                    cps.push(0xFFFD);
                }
                else {
                    var d = string.charCodeAt(i + 1);
                    if (this.inRange(d, 0xDC00, 0xDFFF)) {
                        var a = c & 0x3FF;
                        var b = d & 0x3FF;
                        i += 1;
                        cps.push(0x10000 + (a << 10) + b);
                    }
                    else {
                        cps.push(0xFFFD);
                    }
                }
            }
            i += 1;
        }
        return cps;
    };
    /**
     * @private
     */
    ByteArray.SIZE_OF_BOOLEAN = 1;
    /**
     * @private
     */
    ByteArray.SIZE_OF_INT8 = 1;
    /**
     * @private
     */
    ByteArray.SIZE_OF_INT16 = 2;
    /**
     * @private
     */
    ByteArray.SIZE_OF_INT32 = 4;
    /**
     * @private
     */
    ByteArray.SIZE_OF_UINT8 = 1;
    /**
     * @private
     */
    ByteArray.SIZE_OF_UINT16 = 2;
    /**
     * @private
     */
    ByteArray.SIZE_OF_UINT32 = 4;
    /**
     * @private
     */
    ByteArray.SIZE_OF_FLOAT32 = 4;
    /**
     * @private
     */
    ByteArray.SIZE_OF_FLOAT64 = 8;
    return ByteArray;
})();
window.ByteArray = ByteArray;

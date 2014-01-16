// JS numbers have 53 bits of precission. In most places
// you won't even notice*, but in case you'd like to change
// something, think twice, and than think again.
//
// [*] - e.g. there are SHLs with (32-x), it has been carefully
// checked that the outcomes will fit...
//
reduce_mask_26 = (1 << 26) - 1;
reduce_mask_25 = (1 << 25) - 1;

// sha256 stolen from https://github.com/oftn/common.git 
var SHA256 = function(input, byteOffset, byteLength) {
	"use strict";

	if (Object.prototype.toString.call(input) !== "[object ArrayBuffer]")
		throw new TypeError("First argument must be an ArrayBuffer");

	byteOffset >>>= 0;
	byteLength = (byteLength != null ? byteLength >>> 0 : input.byteLength - byteOffset);

	var
		  checksum_h = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19])
		, input_trailing = byteLength & 0x3f
		, block_offset = byteOffset
		, block_num = (byteLength + 8) / 64 + 1 | 0
		, fill = 64
		, i, i_uint8, b
		, digest
		, tmp = new Uint32Array(2)
	;

	while (block_num--) {

		i = new DataView(new ArrayBuffer(256));
		i_uint8 = new Uint8Array(i.buffer);

		if (block_offset + 64 > byteLength) {
			if (input_trailing >= 0) {
				i_uint8.set(new Uint8Array(input, block_offset, input_trailing));
				i.setUint8(input_trailing, 0x80);
			}

			if (!block_num) {
				i.setUint32(64 - 4, byteLength << 3);
			} else {
				input_trailing -= 64;
			}

		} else {
			i_uint8.set(new Uint8Array(input, block_offset, 64));
		}

		b = new Uint32Array(checksum_h);
		block_offset += 64;

		tmp[0] = (((b[7] + ((((b[4] & 0xFFFFFFFF) >>> 6) | (b[4] << (32 - 6))) ^ (((b[4] & 0xFFFFFFFF) >>> 11) | (b[4] << (32 - 11))) ^ (((b[4] & 0xFFFFFFFF) >>> 25) | (b[4] << (32 - 25)))) >>> 0) + (b[6] ^ (b[4] & (b[5] ^ b[6]))) >>> 0) + 0x428A2F98 >>> 0) + i.getUint32(0); tmp[1] = ((((b[0] & 0xFFFFFFFF) >>> 2) | (b[0] << (32 - 2))) ^ (((b[0] & 0xFFFFFFFF) >>> 13) | (b[0] << (32 - 13))) ^ (((b[0] & 0xFFFFFFFF) >>> 22) | (b[0] << (32 - 22)))) + ((b[0] & b[1]) | (b[2] & (b[0] | b[1]))); b[3] += tmp[0]; b[7] = tmp[0] + tmp[1];
		tmp[0] = (((b[6] + ((((b[3] & 0xFFFFFFFF) >>> 6) | (b[3] << (32 - 6))) ^ (((b[3] & 0xFFFFFFFF) >>> 11) | (b[3] << (32 - 11))) ^ (((b[3] & 0xFFFFFFFF) >>> 25) | (b[3] << (32 - 25)))) >>> 0) + (b[5] ^ (b[3] & (b[4] ^ b[5]))) >>> 0) + 0x71374491 >>> 0) + i.getUint32(4); tmp[1] = ((((b[7] & 0xFFFFFFFF) >>> 2) | (b[7] << (32 - 2))) ^ (((b[7] & 0xFFFFFFFF) >>> 13) | (b[7] << (32 - 13))) ^ (((b[7] & 0xFFFFFFFF) >>> 22) | (b[7] << (32 - 22)))) + ((b[7] & b[0]) | (b[1] & (b[7] | b[0]))); b[2] += tmp[0]; b[6] = tmp[0] + tmp[1];
		tmp[0] = (((b[5] + ((((b[2] & 0xFFFFFFFF) >>> 6) | (b[2] << (32 - 6))) ^ (((b[2] & 0xFFFFFFFF) >>> 11) | (b[2] << (32 - 11))) ^ (((b[2] & 0xFFFFFFFF) >>> 25) | (b[2] << (32 - 25)))) >>> 0) + (b[4] ^ (b[2] & (b[3] ^ b[4]))) >>> 0) + 0xB5C0FBCF >>> 0) + i.getUint32(8); tmp[1] = ((((b[6] & 0xFFFFFFFF) >>> 2) | (b[6] << (32 - 2))) ^ (((b[6] & 0xFFFFFFFF) >>> 13) | (b[6] << (32 - 13))) ^ (((b[6] & 0xFFFFFFFF) >>> 22) | (b[6] << (32 - 22)))) + ((b[6] & b[7]) | (b[0] & (b[6] | b[7]))); b[1] += tmp[0]; b[5] = tmp[0] + tmp[1];
		tmp[0] = (((b[4] + ((((b[1] & 0xFFFFFFFF) >>> 6) | (b[1] << (32 - 6))) ^ (((b[1] & 0xFFFFFFFF) >>> 11) | (b[1] << (32 - 11))) ^ (((b[1] & 0xFFFFFFFF) >>> 25) | (b[1] << (32 - 25)))) >>> 0) + (b[3] ^ (b[1] & (b[2] ^ b[3]))) >>> 0) + 0xE9B5DBA5 >>> 0) + i.getUint32(12); tmp[1] = ((((b[5] & 0xFFFFFFFF) >>> 2) | (b[5] << (32 - 2))) ^ (((b[5] & 0xFFFFFFFF) >>> 13) | (b[5] << (32 - 13))) ^ (((b[5] & 0xFFFFFFFF) >>> 22) | (b[5] << (32 - 22)))) + ((b[5] & b[6]) | (b[7] & (b[5] | b[6]))); b[0] += tmp[0]; b[4] = tmp[0] + tmp[1];
		tmp[0] = (((b[3] + ((((b[0] & 0xFFFFFFFF) >>> 6) | (b[0] << (32 - 6))) ^ (((b[0] & 0xFFFFFFFF) >>> 11) | (b[0] << (32 - 11))) ^ (((b[0] & 0xFFFFFFFF) >>> 25) | (b[0] << (32 - 25)))) >>> 0) + (b[2] ^ (b[0] & (b[1] ^ b[2]))) >>> 0) + 0x3956C25B >>> 0) + i.getUint32(16); tmp[1] = ((((b[4] & 0xFFFFFFFF) >>> 2) | (b[4] << (32 - 2))) ^ (((b[4] & 0xFFFFFFFF) >>> 13) | (b[4] << (32 - 13))) ^ (((b[4] & 0xFFFFFFFF) >>> 22) | (b[4] << (32 - 22)))) + ((b[4] & b[5]) | (b[6] & (b[4] | b[5]))); b[7] += tmp[0]; b[3] = tmp[0] + tmp[1];
		tmp[0] = (((b[2] + ((((b[7] & 0xFFFFFFFF) >>> 6) | (b[7] << (32 - 6))) ^ (((b[7] & 0xFFFFFFFF) >>> 11) | (b[7] << (32 - 11))) ^ (((b[7] & 0xFFFFFFFF) >>> 25) | (b[7] << (32 - 25)))) >>> 0) + (b[1] ^ (b[7] & (b[0] ^ b[1]))) >>> 0) + 0x59F111F1 >>> 0) + i.getUint32(20); tmp[1] = ((((b[3] & 0xFFFFFFFF) >>> 2) | (b[3] << (32 - 2))) ^ (((b[3] & 0xFFFFFFFF) >>> 13) | (b[3] << (32 - 13))) ^ (((b[3] & 0xFFFFFFFF) >>> 22) | (b[3] << (32 - 22)))) + ((b[3] & b[4]) | (b[5] & (b[3] | b[4]))); b[6] += tmp[0]; b[2] = tmp[0] + tmp[1];
		tmp[0] = (((b[1] + ((((b[6] & 0xFFFFFFFF) >>> 6) | (b[6] << (32 - 6))) ^ (((b[6] & 0xFFFFFFFF) >>> 11) | (b[6] << (32 - 11))) ^ (((b[6] & 0xFFFFFFFF) >>> 25) | (b[6] << (32 - 25)))) >>> 0) + (b[0] ^ (b[6] & (b[7] ^ b[0]))) >>> 0) + 0x923F82A4 >>> 0) + i.getUint32(24); tmp[1] = ((((b[2] & 0xFFFFFFFF) >>> 2) | (b[2] << (32 - 2))) ^ (((b[2] & 0xFFFFFFFF) >>> 13) | (b[2] << (32 - 13))) ^ (((b[2] & 0xFFFFFFFF) >>> 22) | (b[2] << (32 - 22)))) + ((b[2] & b[3]) | (b[4] & (b[2] | b[3]))); b[5] += tmp[0]; b[1] = tmp[0] + tmp[1];
		tmp[0] = (((b[0] + ((((b[5] & 0xFFFFFFFF) >>> 6) | (b[5] << (32 - 6))) ^ (((b[5] & 0xFFFFFFFF) >>> 11) | (b[5] << (32 - 11))) ^ (((b[5] & 0xFFFFFFFF) >>> 25) | (b[5] << (32 - 25)))) >>> 0) + (b[7] ^ (b[5] & (b[6] ^ b[7]))) >>> 0) + 0xAB1C5ED5 >>> 0) + i.getUint32(28); tmp[1] = ((((b[1] & 0xFFFFFFFF) >>> 2) | (b[1] << (32 - 2))) ^ (((b[1] & 0xFFFFFFFF) >>> 13) | (b[1] << (32 - 13))) ^ (((b[1] & 0xFFFFFFFF) >>> 22) | (b[1] << (32 - 22)))) + ((b[1] & b[2]) | (b[3] & (b[1] | b[2]))); b[4] += tmp[0]; b[0] = tmp[0] + tmp[1];
		tmp[0] = (((b[7] + ((((b[4] & 0xFFFFFFFF) >>> 6) | (b[4] << (32 - 6))) ^ (((b[4] & 0xFFFFFFFF) >>> 11) | (b[4] << (32 - 11))) ^ (((b[4] & 0xFFFFFFFF) >>> 25) | (b[4] << (32 - 25)))) >>> 0) + (b[6] ^ (b[4] & (b[5] ^ b[6]))) >>> 0) + 0xD807AA98 >>> 0) + i.getUint32(32); tmp[1] = ((((b[0] & 0xFFFFFFFF) >>> 2) | (b[0] << (32 - 2))) ^ (((b[0] & 0xFFFFFFFF) >>> 13) | (b[0] << (32 - 13))) ^ (((b[0] & 0xFFFFFFFF) >>> 22) | (b[0] << (32 - 22)))) + ((b[0] & b[1]) | (b[2] & (b[0] | b[1]))); b[3] += tmp[0]; b[7] = tmp[0] + tmp[1];
		tmp[0] = (((b[6] + ((((b[3] & 0xFFFFFFFF) >>> 6) | (b[3] << (32 - 6))) ^ (((b[3] & 0xFFFFFFFF) >>> 11) | (b[3] << (32 - 11))) ^ (((b[3] & 0xFFFFFFFF) >>> 25) | (b[3] << (32 - 25)))) >>> 0) + (b[5] ^ (b[3] & (b[4] ^ b[5]))) >>> 0) + 0x12835B01 >>> 0) + i.getUint32(36); tmp[1] = ((((b[7] & 0xFFFFFFFF) >>> 2) | (b[7] << (32 - 2))) ^ (((b[7] & 0xFFFFFFFF) >>> 13) | (b[7] << (32 - 13))) ^ (((b[7] & 0xFFFFFFFF) >>> 22) | (b[7] << (32 - 22)))) + ((b[7] & b[0]) | (b[1] & (b[7] | b[0]))); b[2] += tmp[0]; b[6] = tmp[0] + tmp[1];
		tmp[0] = (((b[5] + ((((b[2] & 0xFFFFFFFF) >>> 6) | (b[2] << (32 - 6))) ^ (((b[2] & 0xFFFFFFFF) >>> 11) | (b[2] << (32 - 11))) ^ (((b[2] & 0xFFFFFFFF) >>> 25) | (b[2] << (32 - 25)))) >>> 0) + (b[4] ^ (b[2] & (b[3] ^ b[4]))) >>> 0) + 0x243185BE >>> 0) + i.getUint32(40); tmp[1] = ((((b[6] & 0xFFFFFFFF) >>> 2) | (b[6] << (32 - 2))) ^ (((b[6] & 0xFFFFFFFF) >>> 13) | (b[6] << (32 - 13))) ^ (((b[6] & 0xFFFFFFFF) >>> 22) | (b[6] << (32 - 22)))) + ((b[6] & b[7]) | (b[0] & (b[6] | b[7]))); b[1] += tmp[0]; b[5] = tmp[0] + tmp[1];
		tmp[0] = (((b[4] + ((((b[1] & 0xFFFFFFFF) >>> 6) | (b[1] << (32 - 6))) ^ (((b[1] & 0xFFFFFFFF) >>> 11) | (b[1] << (32 - 11))) ^ (((b[1] & 0xFFFFFFFF) >>> 25) | (b[1] << (32 - 25)))) >>> 0) + (b[3] ^ (b[1] & (b[2] ^ b[3]))) >>> 0) + 0x550C7DC3 >>> 0) + i.getUint32(44); tmp[1] = ((((b[5] & 0xFFFFFFFF) >>> 2) | (b[5] << (32 - 2))) ^ (((b[5] & 0xFFFFFFFF) >>> 13) | (b[5] << (32 - 13))) ^ (((b[5] & 0xFFFFFFFF) >>> 22) | (b[5] << (32 - 22)))) + ((b[5] & b[6]) | (b[7] & (b[5] | b[6]))); b[0] += tmp[0]; b[4] = tmp[0] + tmp[1];
		tmp[0] = (((b[3] + ((((b[0] & 0xFFFFFFFF) >>> 6) | (b[0] << (32 - 6))) ^ (((b[0] & 0xFFFFFFFF) >>> 11) | (b[0] << (32 - 11))) ^ (((b[0] & 0xFFFFFFFF) >>> 25) | (b[0] << (32 - 25)))) >>> 0) + (b[2] ^ (b[0] & (b[1] ^ b[2]))) >>> 0) + 0x72BE5D74 >>> 0) + i.getUint32(48); tmp[1] = ((((b[4] & 0xFFFFFFFF) >>> 2) | (b[4] << (32 - 2))) ^ (((b[4] & 0xFFFFFFFF) >>> 13) | (b[4] << (32 - 13))) ^ (((b[4] & 0xFFFFFFFF) >>> 22) | (b[4] << (32 - 22)))) + ((b[4] & b[5]) | (b[6] & (b[4] | b[5]))); b[7] += tmp[0]; b[3] = tmp[0] + tmp[1];
		tmp[0] = (((b[2] + ((((b[7] & 0xFFFFFFFF) >>> 6) | (b[7] << (32 - 6))) ^ (((b[7] & 0xFFFFFFFF) >>> 11) | (b[7] << (32 - 11))) ^ (((b[7] & 0xFFFFFFFF) >>> 25) | (b[7] << (32 - 25)))) >>> 0) + (b[1] ^ (b[7] & (b[0] ^ b[1]))) >>> 0) + 0x80DEB1FE >>> 0) + i.getUint32(52); tmp[1] = ((((b[3] & 0xFFFFFFFF) >>> 2) | (b[3] << (32 - 2))) ^ (((b[3] & 0xFFFFFFFF) >>> 13) | (b[3] << (32 - 13))) ^ (((b[3] & 0xFFFFFFFF) >>> 22) | (b[3] << (32 - 22)))) + ((b[3] & b[4]) | (b[5] & (b[3] | b[4]))); b[6] += tmp[0]; b[2] = tmp[0] + tmp[1];
		tmp[0] = (((b[1] + ((((b[6] & 0xFFFFFFFF) >>> 6) | (b[6] << (32 - 6))) ^ (((b[6] & 0xFFFFFFFF) >>> 11) | (b[6] << (32 - 11))) ^ (((b[6] & 0xFFFFFFFF) >>> 25) | (b[6] << (32 - 25)))) >>> 0) + (b[0] ^ (b[6] & (b[7] ^ b[0]))) >>> 0) + 0x9BDC06A7 >>> 0) + i.getUint32(56); tmp[1] = ((((b[2] & 0xFFFFFFFF) >>> 2) | (b[2] << (32 - 2))) ^ (((b[2] & 0xFFFFFFFF) >>> 13) | (b[2] << (32 - 13))) ^ (((b[2] & 0xFFFFFFFF) >>> 22) | (b[2] << (32 - 22)))) + ((b[2] & b[3]) | (b[4] & (b[2] | b[3]))); b[5] += tmp[0]; b[1] = tmp[0] + tmp[1];
		tmp[0] = (((b[0] + ((((b[5] & 0xFFFFFFFF) >>> 6) | (b[5] << (32 - 6))) ^ (((b[5] & 0xFFFFFFFF) >>> 11) | (b[5] << (32 - 11))) ^ (((b[5] & 0xFFFFFFFF) >>> 25) | (b[5] << (32 - 25)))) >>> 0) + (b[7] ^ (b[5] & (b[6] ^ b[7]))) >>> 0) + 0xC19BF174 >>> 0) + i.getUint32(60); tmp[1] = ((((b[1] & 0xFFFFFFFF) >>> 2) | (b[1] << (32 - 2))) ^ (((b[1] & 0xFFFFFFFF) >>> 13) | (b[1] << (32 - 13))) ^ (((b[1] & 0xFFFFFFFF) >>> 22) | (b[1] << (32 - 22)))) + ((b[1] & b[2]) | (b[3] & (b[1] | b[2]))); b[4] += tmp[0]; b[0] = tmp[0] + tmp[1];
		tmp[0] = (((b[7] + ((((b[4] & 0xFFFFFFFF) >>> 6) | (b[4] << (32 - 6))) ^ (((b[4] & 0xFFFFFFFF) >>> 11) | (b[4] << (32 - 11))) ^ (((b[4] & 0xFFFFFFFF) >>> 25) | (b[4] << (32 - 25)))) >>> 0) + (b[6] ^ (b[4] & (b[5] ^ b[6]))) >>> 0) + 0xE49B69C1 >>> 0) + (i.setUint32(64, ((((((i.getUint32(64 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(64 - 8) << (32 - 17))) ^ (((i.getUint32(64 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(64 - 8) << (32 - 19))) ^ ((i.getUint32(64 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(64 - 28) >>> 0) + ((((i.getUint32(64 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(64 - 60) << (32 - 7))) ^ (((i.getUint32(64 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(64 - 60) << (32 - 18))) ^ ((i.getUint32(64 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(64 - 64)), i.getUint32(64)); tmp[1] = ((((b[0] & 0xFFFFFFFF) >>> 2) | (b[0] << (32 - 2))) ^ (((b[0] & 0xFFFFFFFF) >>> 13) | (b[0] << (32 - 13))) ^ (((b[0] & 0xFFFFFFFF) >>> 22) | (b[0] << (32 - 22)))) + ((b[0] & b[1]) | (b[2] & (b[0] | b[1]))); b[3] += tmp[0]; b[7] = tmp[0] + tmp[1];
		tmp[0] = (((b[6] + ((((b[3] & 0xFFFFFFFF) >>> 6) | (b[3] << (32 - 6))) ^ (((b[3] & 0xFFFFFFFF) >>> 11) | (b[3] << (32 - 11))) ^ (((b[3] & 0xFFFFFFFF) >>> 25) | (b[3] << (32 - 25)))) >>> 0) + (b[5] ^ (b[3] & (b[4] ^ b[5]))) >>> 0) + 0xEFBE4786 >>> 0) + (i.setUint32(68, ((((((i.getUint32(68 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(68 - 8) << (32 - 17))) ^ (((i.getUint32(68 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(68 - 8) << (32 - 19))) ^ ((i.getUint32(68 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(68 - 28) >>> 0) + ((((i.getUint32(68 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(68 - 60) << (32 - 7))) ^ (((i.getUint32(68 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(68 - 60) << (32 - 18))) ^ ((i.getUint32(68 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(68 - 64)), i.getUint32(68)); tmp[1] = ((((b[7] & 0xFFFFFFFF) >>> 2) | (b[7] << (32 - 2))) ^ (((b[7] & 0xFFFFFFFF) >>> 13) | (b[7] << (32 - 13))) ^ (((b[7] & 0xFFFFFFFF) >>> 22) | (b[7] << (32 - 22)))) + ((b[7] & b[0]) | (b[1] & (b[7] | b[0]))); b[2] += tmp[0]; b[6] = tmp[0] + tmp[1];
		tmp[0] = (((b[5] + ((((b[2] & 0xFFFFFFFF) >>> 6) | (b[2] << (32 - 6))) ^ (((b[2] & 0xFFFFFFFF) >>> 11) | (b[2] << (32 - 11))) ^ (((b[2] & 0xFFFFFFFF) >>> 25) | (b[2] << (32 - 25)))) >>> 0) + (b[4] ^ (b[2] & (b[3] ^ b[4]))) >>> 0) + 0x0FC19DC6 >>> 0) + (i.setUint32(72, ((((((i.getUint32(72 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(72 - 8) << (32 - 17))) ^ (((i.getUint32(72 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(72 - 8) << (32 - 19))) ^ ((i.getUint32(72 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(72 - 28) >>> 0) + ((((i.getUint32(72 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(72 - 60) << (32 - 7))) ^ (((i.getUint32(72 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(72 - 60) << (32 - 18))) ^ ((i.getUint32(72 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(72 - 64)), i.getUint32(72)); tmp[1] = ((((b[6] & 0xFFFFFFFF) >>> 2) | (b[6] << (32 - 2))) ^ (((b[6] & 0xFFFFFFFF) >>> 13) | (b[6] << (32 - 13))) ^ (((b[6] & 0xFFFFFFFF) >>> 22) | (b[6] << (32 - 22)))) + ((b[6] & b[7]) | (b[0] & (b[6] | b[7]))); b[1] += tmp[0]; b[5] = tmp[0] + tmp[1];
		tmp[0] = (((b[4] + ((((b[1] & 0xFFFFFFFF) >>> 6) | (b[1] << (32 - 6))) ^ (((b[1] & 0xFFFFFFFF) >>> 11) | (b[1] << (32 - 11))) ^ (((b[1] & 0xFFFFFFFF) >>> 25) | (b[1] << (32 - 25)))) >>> 0) + (b[3] ^ (b[1] & (b[2] ^ b[3]))) >>> 0) + 0x240CA1CC >>> 0) + (i.setUint32(76, ((((((i.getUint32(76 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(76 - 8) << (32 - 17))) ^ (((i.getUint32(76 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(76 - 8) << (32 - 19))) ^ ((i.getUint32(76 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(76 - 28) >>> 0) + ((((i.getUint32(76 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(76 - 60) << (32 - 7))) ^ (((i.getUint32(76 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(76 - 60) << (32 - 18))) ^ ((i.getUint32(76 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(76 - 64)), i.getUint32(76)); tmp[1] = ((((b[5] & 0xFFFFFFFF) >>> 2) | (b[5] << (32 - 2))) ^ (((b[5] & 0xFFFFFFFF) >>> 13) | (b[5] << (32 - 13))) ^ (((b[5] & 0xFFFFFFFF) >>> 22) | (b[5] << (32 - 22)))) + ((b[5] & b[6]) | (b[7] & (b[5] | b[6]))); b[0] += tmp[0]; b[4] = tmp[0] + tmp[1];
		tmp[0] = (((b[3] + ((((b[0] & 0xFFFFFFFF) >>> 6) | (b[0] << (32 - 6))) ^ (((b[0] & 0xFFFFFFFF) >>> 11) | (b[0] << (32 - 11))) ^ (((b[0] & 0xFFFFFFFF) >>> 25) | (b[0] << (32 - 25)))) >>> 0) + (b[2] ^ (b[0] & (b[1] ^ b[2]))) >>> 0) + 0x2DE92C6F >>> 0) + (i.setUint32(80, ((((((i.getUint32(80 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(80 - 8) << (32 - 17))) ^ (((i.getUint32(80 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(80 - 8) << (32 - 19))) ^ ((i.getUint32(80 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(80 - 28) >>> 0) + ((((i.getUint32(80 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(80 - 60) << (32 - 7))) ^ (((i.getUint32(80 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(80 - 60) << (32 - 18))) ^ ((i.getUint32(80 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(80 - 64)), i.getUint32(80)); tmp[1] = ((((b[4] & 0xFFFFFFFF) >>> 2) | (b[4] << (32 - 2))) ^ (((b[4] & 0xFFFFFFFF) >>> 13) | (b[4] << (32 - 13))) ^ (((b[4] & 0xFFFFFFFF) >>> 22) | (b[4] << (32 - 22)))) + ((b[4] & b[5]) | (b[6] & (b[4] | b[5]))); b[7] += tmp[0]; b[3] = tmp[0] + tmp[1];
		tmp[0] = (((b[2] + ((((b[7] & 0xFFFFFFFF) >>> 6) | (b[7] << (32 - 6))) ^ (((b[7] & 0xFFFFFFFF) >>> 11) | (b[7] << (32 - 11))) ^ (((b[7] & 0xFFFFFFFF) >>> 25) | (b[7] << (32 - 25)))) >>> 0) + (b[1] ^ (b[7] & (b[0] ^ b[1]))) >>> 0) + 0x4A7484AA >>> 0) + (i.setUint32(84, ((((((i.getUint32(84 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(84 - 8) << (32 - 17))) ^ (((i.getUint32(84 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(84 - 8) << (32 - 19))) ^ ((i.getUint32(84 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(84 - 28) >>> 0) + ((((i.getUint32(84 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(84 - 60) << (32 - 7))) ^ (((i.getUint32(84 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(84 - 60) << (32 - 18))) ^ ((i.getUint32(84 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(84 - 64)), i.getUint32(84)); tmp[1] = ((((b[3] & 0xFFFFFFFF) >>> 2) | (b[3] << (32 - 2))) ^ (((b[3] & 0xFFFFFFFF) >>> 13) | (b[3] << (32 - 13))) ^ (((b[3] & 0xFFFFFFFF) >>> 22) | (b[3] << (32 - 22)))) + ((b[3] & b[4]) | (b[5] & (b[3] | b[4]))); b[6] += tmp[0]; b[2] = tmp[0] + tmp[1];
		tmp[0] = (((b[1] + ((((b[6] & 0xFFFFFFFF) >>> 6) | (b[6] << (32 - 6))) ^ (((b[6] & 0xFFFFFFFF) >>> 11) | (b[6] << (32 - 11))) ^ (((b[6] & 0xFFFFFFFF) >>> 25) | (b[6] << (32 - 25)))) >>> 0) + (b[0] ^ (b[6] & (b[7] ^ b[0]))) >>> 0) + 0x5CB0A9DC >>> 0) + (i.setUint32(88, ((((((i.getUint32(88 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(88 - 8) << (32 - 17))) ^ (((i.getUint32(88 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(88 - 8) << (32 - 19))) ^ ((i.getUint32(88 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(88 - 28) >>> 0) + ((((i.getUint32(88 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(88 - 60) << (32 - 7))) ^ (((i.getUint32(88 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(88 - 60) << (32 - 18))) ^ ((i.getUint32(88 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(88 - 64)), i.getUint32(88)); tmp[1] = ((((b[2] & 0xFFFFFFFF) >>> 2) | (b[2] << (32 - 2))) ^ (((b[2] & 0xFFFFFFFF) >>> 13) | (b[2] << (32 - 13))) ^ (((b[2] & 0xFFFFFFFF) >>> 22) | (b[2] << (32 - 22)))) + ((b[2] & b[3]) | (b[4] & (b[2] | b[3]))); b[5] += tmp[0]; b[1] = tmp[0] + tmp[1];
		tmp[0] = (((b[0] + ((((b[5] & 0xFFFFFFFF) >>> 6) | (b[5] << (32 - 6))) ^ (((b[5] & 0xFFFFFFFF) >>> 11) | (b[5] << (32 - 11))) ^ (((b[5] & 0xFFFFFFFF) >>> 25) | (b[5] << (32 - 25)))) >>> 0) + (b[7] ^ (b[5] & (b[6] ^ b[7]))) >>> 0) + 0x76F988DA >>> 0) + (i.setUint32(92, ((((((i.getUint32(92 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(92 - 8) << (32 - 17))) ^ (((i.getUint32(92 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(92 - 8) << (32 - 19))) ^ ((i.getUint32(92 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(92 - 28) >>> 0) + ((((i.getUint32(92 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(92 - 60) << (32 - 7))) ^ (((i.getUint32(92 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(92 - 60) << (32 - 18))) ^ ((i.getUint32(92 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(92 - 64)), i.getUint32(92)); tmp[1] = ((((b[1] & 0xFFFFFFFF) >>> 2) | (b[1] << (32 - 2))) ^ (((b[1] & 0xFFFFFFFF) >>> 13) | (b[1] << (32 - 13))) ^ (((b[1] & 0xFFFFFFFF) >>> 22) | (b[1] << (32 - 22)))) + ((b[1] & b[2]) | (b[3] & (b[1] | b[2]))); b[4] += tmp[0]; b[0] = tmp[0] + tmp[1];
		tmp[0] = (((b[7] + ((((b[4] & 0xFFFFFFFF) >>> 6) | (b[4] << (32 - 6))) ^ (((b[4] & 0xFFFFFFFF) >>> 11) | (b[4] << (32 - 11))) ^ (((b[4] & 0xFFFFFFFF) >>> 25) | (b[4] << (32 - 25)))) >>> 0) + (b[6] ^ (b[4] & (b[5] ^ b[6]))) >>> 0) + 0x983E5152 >>> 0) + (i.setUint32(96, ((((((i.getUint32(96 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(96 - 8) << (32 - 17))) ^ (((i.getUint32(96 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(96 - 8) << (32 - 19))) ^ ((i.getUint32(96 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(96 - 28) >>> 0) + ((((i.getUint32(96 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(96 - 60) << (32 - 7))) ^ (((i.getUint32(96 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(96 - 60) << (32 - 18))) ^ ((i.getUint32(96 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(96 - 64)), i.getUint32(96)); tmp[1] = ((((b[0] & 0xFFFFFFFF) >>> 2) | (b[0] << (32 - 2))) ^ (((b[0] & 0xFFFFFFFF) >>> 13) | (b[0] << (32 - 13))) ^ (((b[0] & 0xFFFFFFFF) >>> 22) | (b[0] << (32 - 22)))) + ((b[0] & b[1]) | (b[2] & (b[0] | b[1]))); b[3] += tmp[0]; b[7] = tmp[0] + tmp[1];
		tmp[0] = (((b[6] + ((((b[3] & 0xFFFFFFFF) >>> 6) | (b[3] << (32 - 6))) ^ (((b[3] & 0xFFFFFFFF) >>> 11) | (b[3] << (32 - 11))) ^ (((b[3] & 0xFFFFFFFF) >>> 25) | (b[3] << (32 - 25)))) >>> 0) + (b[5] ^ (b[3] & (b[4] ^ b[5]))) >>> 0) + 0xA831C66D >>> 0) + (i.setUint32(100, ((((((i.getUint32(100 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(100 - 8) << (32 - 17))) ^ (((i.getUint32(100 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(100 - 8) << (32 - 19))) ^ ((i.getUint32(100 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(100 - 28) >>> 0) + ((((i.getUint32(100 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(100 - 60) << (32 - 7))) ^ (((i.getUint32(100 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(100 - 60) << (32 - 18))) ^ ((i.getUint32(100 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(100 - 64)), i.getUint32(100)); tmp[1] = ((((b[7] & 0xFFFFFFFF) >>> 2) | (b[7] << (32 - 2))) ^ (((b[7] & 0xFFFFFFFF) >>> 13) | (b[7] << (32 - 13))) ^ (((b[7] & 0xFFFFFFFF) >>> 22) | (b[7] << (32 - 22)))) + ((b[7] & b[0]) | (b[1] & (b[7] | b[0]))); b[2] += tmp[0]; b[6] = tmp[0] + tmp[1];
		tmp[0] = (((b[5] + ((((b[2] & 0xFFFFFFFF) >>> 6) | (b[2] << (32 - 6))) ^ (((b[2] & 0xFFFFFFFF) >>> 11) | (b[2] << (32 - 11))) ^ (((b[2] & 0xFFFFFFFF) >>> 25) | (b[2] << (32 - 25)))) >>> 0) + (b[4] ^ (b[2] & (b[3] ^ b[4]))) >>> 0) + 0xB00327C8 >>> 0) + (i.setUint32(104, ((((((i.getUint32(104 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(104 - 8) << (32 - 17))) ^ (((i.getUint32(104 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(104 - 8) << (32 - 19))) ^ ((i.getUint32(104 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(104 - 28) >>> 0) + ((((i.getUint32(104 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(104 - 60) << (32 - 7))) ^ (((i.getUint32(104 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(104 - 60) << (32 - 18))) ^ ((i.getUint32(104 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(104 - 64)), i.getUint32(104)); tmp[1] = ((((b[6] & 0xFFFFFFFF) >>> 2) | (b[6] << (32 - 2))) ^ (((b[6] & 0xFFFFFFFF) >>> 13) | (b[6] << (32 - 13))) ^ (((b[6] & 0xFFFFFFFF) >>> 22) | (b[6] << (32 - 22)))) + ((b[6] & b[7]) | (b[0] & (b[6] | b[7]))); b[1] += tmp[0]; b[5] = tmp[0] + tmp[1];
		tmp[0] = (((b[4] + ((((b[1] & 0xFFFFFFFF) >>> 6) | (b[1] << (32 - 6))) ^ (((b[1] & 0xFFFFFFFF) >>> 11) | (b[1] << (32 - 11))) ^ (((b[1] & 0xFFFFFFFF) >>> 25) | (b[1] << (32 - 25)))) >>> 0) + (b[3] ^ (b[1] & (b[2] ^ b[3]))) >>> 0) + 0xBF597FC7 >>> 0) + (i.setUint32(108, ((((((i.getUint32(108 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(108 - 8) << (32 - 17))) ^ (((i.getUint32(108 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(108 - 8) << (32 - 19))) ^ ((i.getUint32(108 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(108 - 28) >>> 0) + ((((i.getUint32(108 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(108 - 60) << (32 - 7))) ^ (((i.getUint32(108 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(108 - 60) << (32 - 18))) ^ ((i.getUint32(108 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(108 - 64)), i.getUint32(108)); tmp[1] = ((((b[5] & 0xFFFFFFFF) >>> 2) | (b[5] << (32 - 2))) ^ (((b[5] & 0xFFFFFFFF) >>> 13) | (b[5] << (32 - 13))) ^ (((b[5] & 0xFFFFFFFF) >>> 22) | (b[5] << (32 - 22)))) + ((b[5] & b[6]) | (b[7] & (b[5] | b[6]))); b[0] += tmp[0]; b[4] = tmp[0] + tmp[1];
		tmp[0] = (((b[3] + ((((b[0] & 0xFFFFFFFF) >>> 6) | (b[0] << (32 - 6))) ^ (((b[0] & 0xFFFFFFFF) >>> 11) | (b[0] << (32 - 11))) ^ (((b[0] & 0xFFFFFFFF) >>> 25) | (b[0] << (32 - 25)))) >>> 0) + (b[2] ^ (b[0] & (b[1] ^ b[2]))) >>> 0) + 0xC6E00BF3 >>> 0) + (i.setUint32(112, ((((((i.getUint32(112 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(112 - 8) << (32 - 17))) ^ (((i.getUint32(112 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(112 - 8) << (32 - 19))) ^ ((i.getUint32(112 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(112 - 28) >>> 0) + ((((i.getUint32(112 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(112 - 60) << (32 - 7))) ^ (((i.getUint32(112 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(112 - 60) << (32 - 18))) ^ ((i.getUint32(112 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(112 - 64)), i.getUint32(112)); tmp[1] = ((((b[4] & 0xFFFFFFFF) >>> 2) | (b[4] << (32 - 2))) ^ (((b[4] & 0xFFFFFFFF) >>> 13) | (b[4] << (32 - 13))) ^ (((b[4] & 0xFFFFFFFF) >>> 22) | (b[4] << (32 - 22)))) + ((b[4] & b[5]) | (b[6] & (b[4] | b[5]))); b[7] += tmp[0]; b[3] = tmp[0] + tmp[1];
		tmp[0] = (((b[2] + ((((b[7] & 0xFFFFFFFF) >>> 6) | (b[7] << (32 - 6))) ^ (((b[7] & 0xFFFFFFFF) >>> 11) | (b[7] << (32 - 11))) ^ (((b[7] & 0xFFFFFFFF) >>> 25) | (b[7] << (32 - 25)))) >>> 0) + (b[1] ^ (b[7] & (b[0] ^ b[1]))) >>> 0) + 0xD5A79147 >>> 0) + (i.setUint32(116, ((((((i.getUint32(116 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(116 - 8) << (32 - 17))) ^ (((i.getUint32(116 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(116 - 8) << (32 - 19))) ^ ((i.getUint32(116 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(116 - 28) >>> 0) + ((((i.getUint32(116 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(116 - 60) << (32 - 7))) ^ (((i.getUint32(116 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(116 - 60) << (32 - 18))) ^ ((i.getUint32(116 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(116 - 64)), i.getUint32(116)); tmp[1] = ((((b[3] & 0xFFFFFFFF) >>> 2) | (b[3] << (32 - 2))) ^ (((b[3] & 0xFFFFFFFF) >>> 13) | (b[3] << (32 - 13))) ^ (((b[3] & 0xFFFFFFFF) >>> 22) | (b[3] << (32 - 22)))) + ((b[3] & b[4]) | (b[5] & (b[3] | b[4]))); b[6] += tmp[0]; b[2] = tmp[0] + tmp[1];
		tmp[0] = (((b[1] + ((((b[6] & 0xFFFFFFFF) >>> 6) | (b[6] << (32 - 6))) ^ (((b[6] & 0xFFFFFFFF) >>> 11) | (b[6] << (32 - 11))) ^ (((b[6] & 0xFFFFFFFF) >>> 25) | (b[6] << (32 - 25)))) >>> 0) + (b[0] ^ (b[6] & (b[7] ^ b[0]))) >>> 0) + 0x06CA6351 >>> 0) + (i.setUint32(120, ((((((i.getUint32(120 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(120 - 8) << (32 - 17))) ^ (((i.getUint32(120 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(120 - 8) << (32 - 19))) ^ ((i.getUint32(120 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(120 - 28) >>> 0) + ((((i.getUint32(120 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(120 - 60) << (32 - 7))) ^ (((i.getUint32(120 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(120 - 60) << (32 - 18))) ^ ((i.getUint32(120 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(120 - 64)), i.getUint32(120)); tmp[1] = ((((b[2] & 0xFFFFFFFF) >>> 2) | (b[2] << (32 - 2))) ^ (((b[2] & 0xFFFFFFFF) >>> 13) | (b[2] << (32 - 13))) ^ (((b[2] & 0xFFFFFFFF) >>> 22) | (b[2] << (32 - 22)))) + ((b[2] & b[3]) | (b[4] & (b[2] | b[3]))); b[5] += tmp[0]; b[1] = tmp[0] + tmp[1];
		tmp[0] = (((b[0] + ((((b[5] & 0xFFFFFFFF) >>> 6) | (b[5] << (32 - 6))) ^ (((b[5] & 0xFFFFFFFF) >>> 11) | (b[5] << (32 - 11))) ^ (((b[5] & 0xFFFFFFFF) >>> 25) | (b[5] << (32 - 25)))) >>> 0) + (b[7] ^ (b[5] & (b[6] ^ b[7]))) >>> 0) + 0x14292967 >>> 0) + (i.setUint32(124, ((((((i.getUint32(124 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(124 - 8) << (32 - 17))) ^ (((i.getUint32(124 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(124 - 8) << (32 - 19))) ^ ((i.getUint32(124 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(124 - 28) >>> 0) + ((((i.getUint32(124 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(124 - 60) << (32 - 7))) ^ (((i.getUint32(124 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(124 - 60) << (32 - 18))) ^ ((i.getUint32(124 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(124 - 64)), i.getUint32(124)); tmp[1] = ((((b[1] & 0xFFFFFFFF) >>> 2) | (b[1] << (32 - 2))) ^ (((b[1] & 0xFFFFFFFF) >>> 13) | (b[1] << (32 - 13))) ^ (((b[1] & 0xFFFFFFFF) >>> 22) | (b[1] << (32 - 22)))) + ((b[1] & b[2]) | (b[3] & (b[1] | b[2]))); b[4] += tmp[0]; b[0] = tmp[0] + tmp[1];
		tmp[0] = (((b[7] + ((((b[4] & 0xFFFFFFFF) >>> 6) | (b[4] << (32 - 6))) ^ (((b[4] & 0xFFFFFFFF) >>> 11) | (b[4] << (32 - 11))) ^ (((b[4] & 0xFFFFFFFF) >>> 25) | (b[4] << (32 - 25)))) >>> 0) + (b[6] ^ (b[4] & (b[5] ^ b[6]))) >>> 0) + 0x27B70A85 >>> 0) + (i.setUint32(128, ((((((i.getUint32(128 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(128 - 8) << (32 - 17))) ^ (((i.getUint32(128 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(128 - 8) << (32 - 19))) ^ ((i.getUint32(128 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(128 - 28) >>> 0) + ((((i.getUint32(128 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(128 - 60) << (32 - 7))) ^ (((i.getUint32(128 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(128 - 60) << (32 - 18))) ^ ((i.getUint32(128 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(128 - 64)), i.getUint32(128)); tmp[1] = ((((b[0] & 0xFFFFFFFF) >>> 2) | (b[0] << (32 - 2))) ^ (((b[0] & 0xFFFFFFFF) >>> 13) | (b[0] << (32 - 13))) ^ (((b[0] & 0xFFFFFFFF) >>> 22) | (b[0] << (32 - 22)))) + ((b[0] & b[1]) | (b[2] & (b[0] | b[1]))); b[3] += tmp[0]; b[7] = tmp[0] + tmp[1];
		tmp[0] = (((b[6] + ((((b[3] & 0xFFFFFFFF) >>> 6) | (b[3] << (32 - 6))) ^ (((b[3] & 0xFFFFFFFF) >>> 11) | (b[3] << (32 - 11))) ^ (((b[3] & 0xFFFFFFFF) >>> 25) | (b[3] << (32 - 25)))) >>> 0) + (b[5] ^ (b[3] & (b[4] ^ b[5]))) >>> 0) + 0x2E1B2138 >>> 0) + (i.setUint32(132, ((((((i.getUint32(132 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(132 - 8) << (32 - 17))) ^ (((i.getUint32(132 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(132 - 8) << (32 - 19))) ^ ((i.getUint32(132 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(132 - 28) >>> 0) + ((((i.getUint32(132 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(132 - 60) << (32 - 7))) ^ (((i.getUint32(132 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(132 - 60) << (32 - 18))) ^ ((i.getUint32(132 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(132 - 64)), i.getUint32(132)); tmp[1] = ((((b[7] & 0xFFFFFFFF) >>> 2) | (b[7] << (32 - 2))) ^ (((b[7] & 0xFFFFFFFF) >>> 13) | (b[7] << (32 - 13))) ^ (((b[7] & 0xFFFFFFFF) >>> 22) | (b[7] << (32 - 22)))) + ((b[7] & b[0]) | (b[1] & (b[7] | b[0]))); b[2] += tmp[0]; b[6] = tmp[0] + tmp[1];
		tmp[0] = (((b[5] + ((((b[2] & 0xFFFFFFFF) >>> 6) | (b[2] << (32 - 6))) ^ (((b[2] & 0xFFFFFFFF) >>> 11) | (b[2] << (32 - 11))) ^ (((b[2] & 0xFFFFFFFF) >>> 25) | (b[2] << (32 - 25)))) >>> 0) + (b[4] ^ (b[2] & (b[3] ^ b[4]))) >>> 0) + 0x4D2C6DFC >>> 0) + (i.setUint32(136, ((((((i.getUint32(136 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(136 - 8) << (32 - 17))) ^ (((i.getUint32(136 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(136 - 8) << (32 - 19))) ^ ((i.getUint32(136 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(136 - 28) >>> 0) + ((((i.getUint32(136 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(136 - 60) << (32 - 7))) ^ (((i.getUint32(136 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(136 - 60) << (32 - 18))) ^ ((i.getUint32(136 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(136 - 64)), i.getUint32(136)); tmp[1] = ((((b[6] & 0xFFFFFFFF) >>> 2) | (b[6] << (32 - 2))) ^ (((b[6] & 0xFFFFFFFF) >>> 13) | (b[6] << (32 - 13))) ^ (((b[6] & 0xFFFFFFFF) >>> 22) | (b[6] << (32 - 22)))) + ((b[6] & b[7]) | (b[0] & (b[6] | b[7]))); b[1] += tmp[0]; b[5] = tmp[0] + tmp[1];
		tmp[0] = (((b[4] + ((((b[1] & 0xFFFFFFFF) >>> 6) | (b[1] << (32 - 6))) ^ (((b[1] & 0xFFFFFFFF) >>> 11) | (b[1] << (32 - 11))) ^ (((b[1] & 0xFFFFFFFF) >>> 25) | (b[1] << (32 - 25)))) >>> 0) + (b[3] ^ (b[1] & (b[2] ^ b[3]))) >>> 0) + 0x53380D13 >>> 0) + (i.setUint32(140, ((((((i.getUint32(140 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(140 - 8) << (32 - 17))) ^ (((i.getUint32(140 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(140 - 8) << (32 - 19))) ^ ((i.getUint32(140 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(140 - 28) >>> 0) + ((((i.getUint32(140 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(140 - 60) << (32 - 7))) ^ (((i.getUint32(140 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(140 - 60) << (32 - 18))) ^ ((i.getUint32(140 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(140 - 64)), i.getUint32(140)); tmp[1] = ((((b[5] & 0xFFFFFFFF) >>> 2) | (b[5] << (32 - 2))) ^ (((b[5] & 0xFFFFFFFF) >>> 13) | (b[5] << (32 - 13))) ^ (((b[5] & 0xFFFFFFFF) >>> 22) | (b[5] << (32 - 22)))) + ((b[5] & b[6]) | (b[7] & (b[5] | b[6]))); b[0] += tmp[0]; b[4] = tmp[0] + tmp[1];
		tmp[0] = (((b[3] + ((((b[0] & 0xFFFFFFFF) >>> 6) | (b[0] << (32 - 6))) ^ (((b[0] & 0xFFFFFFFF) >>> 11) | (b[0] << (32 - 11))) ^ (((b[0] & 0xFFFFFFFF) >>> 25) | (b[0] << (32 - 25)))) >>> 0) + (b[2] ^ (b[0] & (b[1] ^ b[2]))) >>> 0) + 0x650A7354 >>> 0) + (i.setUint32(144, ((((((i.getUint32(144 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(144 - 8) << (32 - 17))) ^ (((i.getUint32(144 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(144 - 8) << (32 - 19))) ^ ((i.getUint32(144 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(144 - 28) >>> 0) + ((((i.getUint32(144 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(144 - 60) << (32 - 7))) ^ (((i.getUint32(144 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(144 - 60) << (32 - 18))) ^ ((i.getUint32(144 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(144 - 64)), i.getUint32(144)); tmp[1] = ((((b[4] & 0xFFFFFFFF) >>> 2) | (b[4] << (32 - 2))) ^ (((b[4] & 0xFFFFFFFF) >>> 13) | (b[4] << (32 - 13))) ^ (((b[4] & 0xFFFFFFFF) >>> 22) | (b[4] << (32 - 22)))) + ((b[4] & b[5]) | (b[6] & (b[4] | b[5]))); b[7] += tmp[0]; b[3] = tmp[0] + tmp[1];
		tmp[0] = (((b[2] + ((((b[7] & 0xFFFFFFFF) >>> 6) | (b[7] << (32 - 6))) ^ (((b[7] & 0xFFFFFFFF) >>> 11) | (b[7] << (32 - 11))) ^ (((b[7] & 0xFFFFFFFF) >>> 25) | (b[7] << (32 - 25)))) >>> 0) + (b[1] ^ (b[7] & (b[0] ^ b[1]))) >>> 0) + 0x766A0ABB >>> 0) + (i.setUint32(148, ((((((i.getUint32(148 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(148 - 8) << (32 - 17))) ^ (((i.getUint32(148 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(148 - 8) << (32 - 19))) ^ ((i.getUint32(148 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(148 - 28) >>> 0) + ((((i.getUint32(148 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(148 - 60) << (32 - 7))) ^ (((i.getUint32(148 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(148 - 60) << (32 - 18))) ^ ((i.getUint32(148 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(148 - 64)), i.getUint32(148)); tmp[1] = ((((b[3] & 0xFFFFFFFF) >>> 2) | (b[3] << (32 - 2))) ^ (((b[3] & 0xFFFFFFFF) >>> 13) | (b[3] << (32 - 13))) ^ (((b[3] & 0xFFFFFFFF) >>> 22) | (b[3] << (32 - 22)))) + ((b[3] & b[4]) | (b[5] & (b[3] | b[4]))); b[6] += tmp[0]; b[2] = tmp[0] + tmp[1];
		tmp[0] = (((b[1] + ((((b[6] & 0xFFFFFFFF) >>> 6) | (b[6] << (32 - 6))) ^ (((b[6] & 0xFFFFFFFF) >>> 11) | (b[6] << (32 - 11))) ^ (((b[6] & 0xFFFFFFFF) >>> 25) | (b[6] << (32 - 25)))) >>> 0) + (b[0] ^ (b[6] & (b[7] ^ b[0]))) >>> 0) + 0x81C2C92E >>> 0) + (i.setUint32(152, ((((((i.getUint32(152 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(152 - 8) << (32 - 17))) ^ (((i.getUint32(152 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(152 - 8) << (32 - 19))) ^ ((i.getUint32(152 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(152 - 28) >>> 0) + ((((i.getUint32(152 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(152 - 60) << (32 - 7))) ^ (((i.getUint32(152 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(152 - 60) << (32 - 18))) ^ ((i.getUint32(152 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(152 - 64)), i.getUint32(152)); tmp[1] = ((((b[2] & 0xFFFFFFFF) >>> 2) | (b[2] << (32 - 2))) ^ (((b[2] & 0xFFFFFFFF) >>> 13) | (b[2] << (32 - 13))) ^ (((b[2] & 0xFFFFFFFF) >>> 22) | (b[2] << (32 - 22)))) + ((b[2] & b[3]) | (b[4] & (b[2] | b[3]))); b[5] += tmp[0]; b[1] = tmp[0] + tmp[1];
		tmp[0] = (((b[0] + ((((b[5] & 0xFFFFFFFF) >>> 6) | (b[5] << (32 - 6))) ^ (((b[5] & 0xFFFFFFFF) >>> 11) | (b[5] << (32 - 11))) ^ (((b[5] & 0xFFFFFFFF) >>> 25) | (b[5] << (32 - 25)))) >>> 0) + (b[7] ^ (b[5] & (b[6] ^ b[7]))) >>> 0) + 0x92722C85 >>> 0) + (i.setUint32(156, ((((((i.getUint32(156 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(156 - 8) << (32 - 17))) ^ (((i.getUint32(156 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(156 - 8) << (32 - 19))) ^ ((i.getUint32(156 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(156 - 28) >>> 0) + ((((i.getUint32(156 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(156 - 60) << (32 - 7))) ^ (((i.getUint32(156 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(156 - 60) << (32 - 18))) ^ ((i.getUint32(156 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(156 - 64)), i.getUint32(156)); tmp[1] = ((((b[1] & 0xFFFFFFFF) >>> 2) | (b[1] << (32 - 2))) ^ (((b[1] & 0xFFFFFFFF) >>> 13) | (b[1] << (32 - 13))) ^ (((b[1] & 0xFFFFFFFF) >>> 22) | (b[1] << (32 - 22)))) + ((b[1] & b[2]) | (b[3] & (b[1] | b[2]))); b[4] += tmp[0]; b[0] = tmp[0] + tmp[1];
		tmp[0] = (((b[7] + ((((b[4] & 0xFFFFFFFF) >>> 6) | (b[4] << (32 - 6))) ^ (((b[4] & 0xFFFFFFFF) >>> 11) | (b[4] << (32 - 11))) ^ (((b[4] & 0xFFFFFFFF) >>> 25) | (b[4] << (32 - 25)))) >>> 0) + (b[6] ^ (b[4] & (b[5] ^ b[6]))) >>> 0) + 0xA2BFE8A1 >>> 0) + (i.setUint32(160, ((((((i.getUint32(160 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(160 - 8) << (32 - 17))) ^ (((i.getUint32(160 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(160 - 8) << (32 - 19))) ^ ((i.getUint32(160 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(160 - 28) >>> 0) + ((((i.getUint32(160 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(160 - 60) << (32 - 7))) ^ (((i.getUint32(160 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(160 - 60) << (32 - 18))) ^ ((i.getUint32(160 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(160 - 64)), i.getUint32(160)); tmp[1] = ((((b[0] & 0xFFFFFFFF) >>> 2) | (b[0] << (32 - 2))) ^ (((b[0] & 0xFFFFFFFF) >>> 13) | (b[0] << (32 - 13))) ^ (((b[0] & 0xFFFFFFFF) >>> 22) | (b[0] << (32 - 22)))) + ((b[0] & b[1]) | (b[2] & (b[0] | b[1]))); b[3] += tmp[0]; b[7] = tmp[0] + tmp[1];
		tmp[0] = (((b[6] + ((((b[3] & 0xFFFFFFFF) >>> 6) | (b[3] << (32 - 6))) ^ (((b[3] & 0xFFFFFFFF) >>> 11) | (b[3] << (32 - 11))) ^ (((b[3] & 0xFFFFFFFF) >>> 25) | (b[3] << (32 - 25)))) >>> 0) + (b[5] ^ (b[3] & (b[4] ^ b[5]))) >>> 0) + 0xA81A664B >>> 0) + (i.setUint32(164, ((((((i.getUint32(164 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(164 - 8) << (32 - 17))) ^ (((i.getUint32(164 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(164 - 8) << (32 - 19))) ^ ((i.getUint32(164 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(164 - 28) >>> 0) + ((((i.getUint32(164 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(164 - 60) << (32 - 7))) ^ (((i.getUint32(164 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(164 - 60) << (32 - 18))) ^ ((i.getUint32(164 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(164 - 64)), i.getUint32(164)); tmp[1] = ((((b[7] & 0xFFFFFFFF) >>> 2) | (b[7] << (32 - 2))) ^ (((b[7] & 0xFFFFFFFF) >>> 13) | (b[7] << (32 - 13))) ^ (((b[7] & 0xFFFFFFFF) >>> 22) | (b[7] << (32 - 22)))) + ((b[7] & b[0]) | (b[1] & (b[7] | b[0]))); b[2] += tmp[0]; b[6] = tmp[0] + tmp[1];
		tmp[0] = (((b[5] + ((((b[2] & 0xFFFFFFFF) >>> 6) | (b[2] << (32 - 6))) ^ (((b[2] & 0xFFFFFFFF) >>> 11) | (b[2] << (32 - 11))) ^ (((b[2] & 0xFFFFFFFF) >>> 25) | (b[2] << (32 - 25)))) >>> 0) + (b[4] ^ (b[2] & (b[3] ^ b[4]))) >>> 0) + 0xC24B8B70 >>> 0) + (i.setUint32(168, ((((((i.getUint32(168 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(168 - 8) << (32 - 17))) ^ (((i.getUint32(168 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(168 - 8) << (32 - 19))) ^ ((i.getUint32(168 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(168 - 28) >>> 0) + ((((i.getUint32(168 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(168 - 60) << (32 - 7))) ^ (((i.getUint32(168 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(168 - 60) << (32 - 18))) ^ ((i.getUint32(168 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(168 - 64)), i.getUint32(168)); tmp[1] = ((((b[6] & 0xFFFFFFFF) >>> 2) | (b[6] << (32 - 2))) ^ (((b[6] & 0xFFFFFFFF) >>> 13) | (b[6] << (32 - 13))) ^ (((b[6] & 0xFFFFFFFF) >>> 22) | (b[6] << (32 - 22)))) + ((b[6] & b[7]) | (b[0] & (b[6] | b[7]))); b[1] += tmp[0]; b[5] = tmp[0] + tmp[1];
		tmp[0] = (((b[4] + ((((b[1] & 0xFFFFFFFF) >>> 6) | (b[1] << (32 - 6))) ^ (((b[1] & 0xFFFFFFFF) >>> 11) | (b[1] << (32 - 11))) ^ (((b[1] & 0xFFFFFFFF) >>> 25) | (b[1] << (32 - 25)))) >>> 0) + (b[3] ^ (b[1] & (b[2] ^ b[3]))) >>> 0) + 0xC76C51A3 >>> 0) + (i.setUint32(172, ((((((i.getUint32(172 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(172 - 8) << (32 - 17))) ^ (((i.getUint32(172 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(172 - 8) << (32 - 19))) ^ ((i.getUint32(172 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(172 - 28) >>> 0) + ((((i.getUint32(172 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(172 - 60) << (32 - 7))) ^ (((i.getUint32(172 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(172 - 60) << (32 - 18))) ^ ((i.getUint32(172 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(172 - 64)), i.getUint32(172)); tmp[1] = ((((b[5] & 0xFFFFFFFF) >>> 2) | (b[5] << (32 - 2))) ^ (((b[5] & 0xFFFFFFFF) >>> 13) | (b[5] << (32 - 13))) ^ (((b[5] & 0xFFFFFFFF) >>> 22) | (b[5] << (32 - 22)))) + ((b[5] & b[6]) | (b[7] & (b[5] | b[6]))); b[0] += tmp[0]; b[4] = tmp[0] + tmp[1];
		tmp[0] = (((b[3] + ((((b[0] & 0xFFFFFFFF) >>> 6) | (b[0] << (32 - 6))) ^ (((b[0] & 0xFFFFFFFF) >>> 11) | (b[0] << (32 - 11))) ^ (((b[0] & 0xFFFFFFFF) >>> 25) | (b[0] << (32 - 25)))) >>> 0) + (b[2] ^ (b[0] & (b[1] ^ b[2]))) >>> 0) + 0xD192E819 >>> 0) + (i.setUint32(176, ((((((i.getUint32(176 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(176 - 8) << (32 - 17))) ^ (((i.getUint32(176 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(176 - 8) << (32 - 19))) ^ ((i.getUint32(176 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(176 - 28) >>> 0) + ((((i.getUint32(176 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(176 - 60) << (32 - 7))) ^ (((i.getUint32(176 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(176 - 60) << (32 - 18))) ^ ((i.getUint32(176 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(176 - 64)), i.getUint32(176)); tmp[1] = ((((b[4] & 0xFFFFFFFF) >>> 2) | (b[4] << (32 - 2))) ^ (((b[4] & 0xFFFFFFFF) >>> 13) | (b[4] << (32 - 13))) ^ (((b[4] & 0xFFFFFFFF) >>> 22) | (b[4] << (32 - 22)))) + ((b[4] & b[5]) | (b[6] & (b[4] | b[5]))); b[7] += tmp[0]; b[3] = tmp[0] + tmp[1];
		tmp[0] = (((b[2] + ((((b[7] & 0xFFFFFFFF) >>> 6) | (b[7] << (32 - 6))) ^ (((b[7] & 0xFFFFFFFF) >>> 11) | (b[7] << (32 - 11))) ^ (((b[7] & 0xFFFFFFFF) >>> 25) | (b[7] << (32 - 25)))) >>> 0) + (b[1] ^ (b[7] & (b[0] ^ b[1]))) >>> 0) + 0xD6990624 >>> 0) + (i.setUint32(180, ((((((i.getUint32(180 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(180 - 8) << (32 - 17))) ^ (((i.getUint32(180 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(180 - 8) << (32 - 19))) ^ ((i.getUint32(180 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(180 - 28) >>> 0) + ((((i.getUint32(180 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(180 - 60) << (32 - 7))) ^ (((i.getUint32(180 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(180 - 60) << (32 - 18))) ^ ((i.getUint32(180 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(180 - 64)), i.getUint32(180)); tmp[1] = ((((b[3] & 0xFFFFFFFF) >>> 2) | (b[3] << (32 - 2))) ^ (((b[3] & 0xFFFFFFFF) >>> 13) | (b[3] << (32 - 13))) ^ (((b[3] & 0xFFFFFFFF) >>> 22) | (b[3] << (32 - 22)))) + ((b[3] & b[4]) | (b[5] & (b[3] | b[4]))); b[6] += tmp[0]; b[2] = tmp[0] + tmp[1];
		tmp[0] = (((b[1] + ((((b[6] & 0xFFFFFFFF) >>> 6) | (b[6] << (32 - 6))) ^ (((b[6] & 0xFFFFFFFF) >>> 11) | (b[6] << (32 - 11))) ^ (((b[6] & 0xFFFFFFFF) >>> 25) | (b[6] << (32 - 25)))) >>> 0) + (b[0] ^ (b[6] & (b[7] ^ b[0]))) >>> 0) + 0xF40E3585 >>> 0) + (i.setUint32(184, ((((((i.getUint32(184 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(184 - 8) << (32 - 17))) ^ (((i.getUint32(184 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(184 - 8) << (32 - 19))) ^ ((i.getUint32(184 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(184 - 28) >>> 0) + ((((i.getUint32(184 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(184 - 60) << (32 - 7))) ^ (((i.getUint32(184 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(184 - 60) << (32 - 18))) ^ ((i.getUint32(184 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(184 - 64)), i.getUint32(184)); tmp[1] = ((((b[2] & 0xFFFFFFFF) >>> 2) | (b[2] << (32 - 2))) ^ (((b[2] & 0xFFFFFFFF) >>> 13) | (b[2] << (32 - 13))) ^ (((b[2] & 0xFFFFFFFF) >>> 22) | (b[2] << (32 - 22)))) + ((b[2] & b[3]) | (b[4] & (b[2] | b[3]))); b[5] += tmp[0]; b[1] = tmp[0] + tmp[1];
		tmp[0] = (((b[0] + ((((b[5] & 0xFFFFFFFF) >>> 6) | (b[5] << (32 - 6))) ^ (((b[5] & 0xFFFFFFFF) >>> 11) | (b[5] << (32 - 11))) ^ (((b[5] & 0xFFFFFFFF) >>> 25) | (b[5] << (32 - 25)))) >>> 0) + (b[7] ^ (b[5] & (b[6] ^ b[7]))) >>> 0) + 0x106AA070 >>> 0) + (i.setUint32(188, ((((((i.getUint32(188 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(188 - 8) << (32 - 17))) ^ (((i.getUint32(188 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(188 - 8) << (32 - 19))) ^ ((i.getUint32(188 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(188 - 28) >>> 0) + ((((i.getUint32(188 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(188 - 60) << (32 - 7))) ^ (((i.getUint32(188 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(188 - 60) << (32 - 18))) ^ ((i.getUint32(188 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(188 - 64)), i.getUint32(188)); tmp[1] = ((((b[1] & 0xFFFFFFFF) >>> 2) | (b[1] << (32 - 2))) ^ (((b[1] & 0xFFFFFFFF) >>> 13) | (b[1] << (32 - 13))) ^ (((b[1] & 0xFFFFFFFF) >>> 22) | (b[1] << (32 - 22)))) + ((b[1] & b[2]) | (b[3] & (b[1] | b[2]))); b[4] += tmp[0]; b[0] = tmp[0] + tmp[1];
		tmp[0] = (((b[7] + ((((b[4] & 0xFFFFFFFF) >>> 6) | (b[4] << (32 - 6))) ^ (((b[4] & 0xFFFFFFFF) >>> 11) | (b[4] << (32 - 11))) ^ (((b[4] & 0xFFFFFFFF) >>> 25) | (b[4] << (32 - 25)))) >>> 0) + (b[6] ^ (b[4] & (b[5] ^ b[6]))) >>> 0) + 0x19A4C116 >>> 0) + (i.setUint32(192, ((((((i.getUint32(192 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(192 - 8) << (32 - 17))) ^ (((i.getUint32(192 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(192 - 8) << (32 - 19))) ^ ((i.getUint32(192 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(192 - 28) >>> 0) + ((((i.getUint32(192 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(192 - 60) << (32 - 7))) ^ (((i.getUint32(192 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(192 - 60) << (32 - 18))) ^ ((i.getUint32(192 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(192 - 64)), i.getUint32(192)); tmp[1] = ((((b[0] & 0xFFFFFFFF) >>> 2) | (b[0] << (32 - 2))) ^ (((b[0] & 0xFFFFFFFF) >>> 13) | (b[0] << (32 - 13))) ^ (((b[0] & 0xFFFFFFFF) >>> 22) | (b[0] << (32 - 22)))) + ((b[0] & b[1]) | (b[2] & (b[0] | b[1]))); b[3] += tmp[0]; b[7] = tmp[0] + tmp[1];
		tmp[0] = (((b[6] + ((((b[3] & 0xFFFFFFFF) >>> 6) | (b[3] << (32 - 6))) ^ (((b[3] & 0xFFFFFFFF) >>> 11) | (b[3] << (32 - 11))) ^ (((b[3] & 0xFFFFFFFF) >>> 25) | (b[3] << (32 - 25)))) >>> 0) + (b[5] ^ (b[3] & (b[4] ^ b[5]))) >>> 0) + 0x1E376C08 >>> 0) + (i.setUint32(196, ((((((i.getUint32(196 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(196 - 8) << (32 - 17))) ^ (((i.getUint32(196 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(196 - 8) << (32 - 19))) ^ ((i.getUint32(196 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(196 - 28) >>> 0) + ((((i.getUint32(196 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(196 - 60) << (32 - 7))) ^ (((i.getUint32(196 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(196 - 60) << (32 - 18))) ^ ((i.getUint32(196 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(196 - 64)), i.getUint32(196)); tmp[1] = ((((b[7] & 0xFFFFFFFF) >>> 2) | (b[7] << (32 - 2))) ^ (((b[7] & 0xFFFFFFFF) >>> 13) | (b[7] << (32 - 13))) ^ (((b[7] & 0xFFFFFFFF) >>> 22) | (b[7] << (32 - 22)))) + ((b[7] & b[0]) | (b[1] & (b[7] | b[0]))); b[2] += tmp[0]; b[6] = tmp[0] + tmp[1];
		tmp[0] = (((b[5] + ((((b[2] & 0xFFFFFFFF) >>> 6) | (b[2] << (32 - 6))) ^ (((b[2] & 0xFFFFFFFF) >>> 11) | (b[2] << (32 - 11))) ^ (((b[2] & 0xFFFFFFFF) >>> 25) | (b[2] << (32 - 25)))) >>> 0) + (b[4] ^ (b[2] & (b[3] ^ b[4]))) >>> 0) + 0x2748774C >>> 0) + (i.setUint32(200, ((((((i.getUint32(200 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(200 - 8) << (32 - 17))) ^ (((i.getUint32(200 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(200 - 8) << (32 - 19))) ^ ((i.getUint32(200 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(200 - 28) >>> 0) + ((((i.getUint32(200 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(200 - 60) << (32 - 7))) ^ (((i.getUint32(200 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(200 - 60) << (32 - 18))) ^ ((i.getUint32(200 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(200 - 64)), i.getUint32(200)); tmp[1] = ((((b[6] & 0xFFFFFFFF) >>> 2) | (b[6] << (32 - 2))) ^ (((b[6] & 0xFFFFFFFF) >>> 13) | (b[6] << (32 - 13))) ^ (((b[6] & 0xFFFFFFFF) >>> 22) | (b[6] << (32 - 22)))) + ((b[6] & b[7]) | (b[0] & (b[6] | b[7]))); b[1] += tmp[0]; b[5] = tmp[0] + tmp[1];
		tmp[0] = (((b[4] + ((((b[1] & 0xFFFFFFFF) >>> 6) | (b[1] << (32 - 6))) ^ (((b[1] & 0xFFFFFFFF) >>> 11) | (b[1] << (32 - 11))) ^ (((b[1] & 0xFFFFFFFF) >>> 25) | (b[1] << (32 - 25)))) >>> 0) + (b[3] ^ (b[1] & (b[2] ^ b[3]))) >>> 0) + 0x34B0BCB5 >>> 0) + (i.setUint32(204, ((((((i.getUint32(204 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(204 - 8) << (32 - 17))) ^ (((i.getUint32(204 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(204 - 8) << (32 - 19))) ^ ((i.getUint32(204 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(204 - 28) >>> 0) + ((((i.getUint32(204 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(204 - 60) << (32 - 7))) ^ (((i.getUint32(204 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(204 - 60) << (32 - 18))) ^ ((i.getUint32(204 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(204 - 64)), i.getUint32(204)); tmp[1] = ((((b[5] & 0xFFFFFFFF) >>> 2) | (b[5] << (32 - 2))) ^ (((b[5] & 0xFFFFFFFF) >>> 13) | (b[5] << (32 - 13))) ^ (((b[5] & 0xFFFFFFFF) >>> 22) | (b[5] << (32 - 22)))) + ((b[5] & b[6]) | (b[7] & (b[5] | b[6]))); b[0] += tmp[0]; b[4] = tmp[0] + tmp[1];
		tmp[0] = (((b[3] + ((((b[0] & 0xFFFFFFFF) >>> 6) | (b[0] << (32 - 6))) ^ (((b[0] & 0xFFFFFFFF) >>> 11) | (b[0] << (32 - 11))) ^ (((b[0] & 0xFFFFFFFF) >>> 25) | (b[0] << (32 - 25)))) >>> 0) + (b[2] ^ (b[0] & (b[1] ^ b[2]))) >>> 0) + 0x391C0CB3 >>> 0) + (i.setUint32(208, ((((((i.getUint32(208 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(208 - 8) << (32 - 17))) ^ (((i.getUint32(208 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(208 - 8) << (32 - 19))) ^ ((i.getUint32(208 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(208 - 28) >>> 0) + ((((i.getUint32(208 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(208 - 60) << (32 - 7))) ^ (((i.getUint32(208 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(208 - 60) << (32 - 18))) ^ ((i.getUint32(208 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(208 - 64)), i.getUint32(208)); tmp[1] = ((((b[4] & 0xFFFFFFFF) >>> 2) | (b[4] << (32 - 2))) ^ (((b[4] & 0xFFFFFFFF) >>> 13) | (b[4] << (32 - 13))) ^ (((b[4] & 0xFFFFFFFF) >>> 22) | (b[4] << (32 - 22)))) + ((b[4] & b[5]) | (b[6] & (b[4] | b[5]))); b[7] += tmp[0]; b[3] = tmp[0] + tmp[1];
		tmp[0] = (((b[2] + ((((b[7] & 0xFFFFFFFF) >>> 6) | (b[7] << (32 - 6))) ^ (((b[7] & 0xFFFFFFFF) >>> 11) | (b[7] << (32 - 11))) ^ (((b[7] & 0xFFFFFFFF) >>> 25) | (b[7] << (32 - 25)))) >>> 0) + (b[1] ^ (b[7] & (b[0] ^ b[1]))) >>> 0) + 0x4ED8AA4A >>> 0) + (i.setUint32(212, ((((((i.getUint32(212 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(212 - 8) << (32 - 17))) ^ (((i.getUint32(212 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(212 - 8) << (32 - 19))) ^ ((i.getUint32(212 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(212 - 28) >>> 0) + ((((i.getUint32(212 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(212 - 60) << (32 - 7))) ^ (((i.getUint32(212 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(212 - 60) << (32 - 18))) ^ ((i.getUint32(212 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(212 - 64)), i.getUint32(212)); tmp[1] = ((((b[3] & 0xFFFFFFFF) >>> 2) | (b[3] << (32 - 2))) ^ (((b[3] & 0xFFFFFFFF) >>> 13) | (b[3] << (32 - 13))) ^ (((b[3] & 0xFFFFFFFF) >>> 22) | (b[3] << (32 - 22)))) + ((b[3] & b[4]) | (b[5] & (b[3] | b[4]))); b[6] += tmp[0]; b[2] = tmp[0] + tmp[1];
		tmp[0] = (((b[1] + ((((b[6] & 0xFFFFFFFF) >>> 6) | (b[6] << (32 - 6))) ^ (((b[6] & 0xFFFFFFFF) >>> 11) | (b[6] << (32 - 11))) ^ (((b[6] & 0xFFFFFFFF) >>> 25) | (b[6] << (32 - 25)))) >>> 0) + (b[0] ^ (b[6] & (b[7] ^ b[0]))) >>> 0) + 0x5B9CCA4F >>> 0) + (i.setUint32(216, ((((((i.getUint32(216 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(216 - 8) << (32 - 17))) ^ (((i.getUint32(216 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(216 - 8) << (32 - 19))) ^ ((i.getUint32(216 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(216 - 28) >>> 0) + ((((i.getUint32(216 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(216 - 60) << (32 - 7))) ^ (((i.getUint32(216 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(216 - 60) << (32 - 18))) ^ ((i.getUint32(216 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(216 - 64)), i.getUint32(216)); tmp[1] = ((((b[2] & 0xFFFFFFFF) >>> 2) | (b[2] << (32 - 2))) ^ (((b[2] & 0xFFFFFFFF) >>> 13) | (b[2] << (32 - 13))) ^ (((b[2] & 0xFFFFFFFF) >>> 22) | (b[2] << (32 - 22)))) + ((b[2] & b[3]) | (b[4] & (b[2] | b[3]))); b[5] += tmp[0]; b[1] = tmp[0] + tmp[1];
		tmp[0] = (((b[0] + ((((b[5] & 0xFFFFFFFF) >>> 6) | (b[5] << (32 - 6))) ^ (((b[5] & 0xFFFFFFFF) >>> 11) | (b[5] << (32 - 11))) ^ (((b[5] & 0xFFFFFFFF) >>> 25) | (b[5] << (32 - 25)))) >>> 0) + (b[7] ^ (b[5] & (b[6] ^ b[7]))) >>> 0) + 0x682E6FF3 >>> 0) + (i.setUint32(220, ((((((i.getUint32(220 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(220 - 8) << (32 - 17))) ^ (((i.getUint32(220 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(220 - 8) << (32 - 19))) ^ ((i.getUint32(220 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(220 - 28) >>> 0) + ((((i.getUint32(220 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(220 - 60) << (32 - 7))) ^ (((i.getUint32(220 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(220 - 60) << (32 - 18))) ^ ((i.getUint32(220 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(220 - 64)), i.getUint32(220)); tmp[1] = ((((b[1] & 0xFFFFFFFF) >>> 2) | (b[1] << (32 - 2))) ^ (((b[1] & 0xFFFFFFFF) >>> 13) | (b[1] << (32 - 13))) ^ (((b[1] & 0xFFFFFFFF) >>> 22) | (b[1] << (32 - 22)))) + ((b[1] & b[2]) | (b[3] & (b[1] | b[2]))); b[4] += tmp[0]; b[0] = tmp[0] + tmp[1];
		tmp[0] = (((b[7] + ((((b[4] & 0xFFFFFFFF) >>> 6) | (b[4] << (32 - 6))) ^ (((b[4] & 0xFFFFFFFF) >>> 11) | (b[4] << (32 - 11))) ^ (((b[4] & 0xFFFFFFFF) >>> 25) | (b[4] << (32 - 25)))) >>> 0) + (b[6] ^ (b[4] & (b[5] ^ b[6]))) >>> 0) + 0x748F82EE >>> 0) + (i.setUint32(224, ((((((i.getUint32(224 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(224 - 8) << (32 - 17))) ^ (((i.getUint32(224 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(224 - 8) << (32 - 19))) ^ ((i.getUint32(224 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(224 - 28) >>> 0) + ((((i.getUint32(224 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(224 - 60) << (32 - 7))) ^ (((i.getUint32(224 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(224 - 60) << (32 - 18))) ^ ((i.getUint32(224 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(224 - 64)), i.getUint32(224)); tmp[1] = ((((b[0] & 0xFFFFFFFF) >>> 2) | (b[0] << (32 - 2))) ^ (((b[0] & 0xFFFFFFFF) >>> 13) | (b[0] << (32 - 13))) ^ (((b[0] & 0xFFFFFFFF) >>> 22) | (b[0] << (32 - 22)))) + ((b[0] & b[1]) | (b[2] & (b[0] | b[1]))); b[3] += tmp[0]; b[7] = tmp[0] + tmp[1];
		tmp[0] = (((b[6] + ((((b[3] & 0xFFFFFFFF) >>> 6) | (b[3] << (32 - 6))) ^ (((b[3] & 0xFFFFFFFF) >>> 11) | (b[3] << (32 - 11))) ^ (((b[3] & 0xFFFFFFFF) >>> 25) | (b[3] << (32 - 25)))) >>> 0) + (b[5] ^ (b[3] & (b[4] ^ b[5]))) >>> 0) + 0x78A5636F >>> 0) + (i.setUint32(228, ((((((i.getUint32(228 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(228 - 8) << (32 - 17))) ^ (((i.getUint32(228 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(228 - 8) << (32 - 19))) ^ ((i.getUint32(228 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(228 - 28) >>> 0) + ((((i.getUint32(228 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(228 - 60) << (32 - 7))) ^ (((i.getUint32(228 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(228 - 60) << (32 - 18))) ^ ((i.getUint32(228 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(228 - 64)), i.getUint32(228)); tmp[1] = ((((b[7] & 0xFFFFFFFF) >>> 2) | (b[7] << (32 - 2))) ^ (((b[7] & 0xFFFFFFFF) >>> 13) | (b[7] << (32 - 13))) ^ (((b[7] & 0xFFFFFFFF) >>> 22) | (b[7] << (32 - 22)))) + ((b[7] & b[0]) | (b[1] & (b[7] | b[0]))); b[2] += tmp[0]; b[6] = tmp[0] + tmp[1];
		tmp[0] = (((b[5] + ((((b[2] & 0xFFFFFFFF) >>> 6) | (b[2] << (32 - 6))) ^ (((b[2] & 0xFFFFFFFF) >>> 11) | (b[2] << (32 - 11))) ^ (((b[2] & 0xFFFFFFFF) >>> 25) | (b[2] << (32 - 25)))) >>> 0) + (b[4] ^ (b[2] & (b[3] ^ b[4]))) >>> 0) + 0x84C87814 >>> 0) + (i.setUint32(232, ((((((i.getUint32(232 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(232 - 8) << (32 - 17))) ^ (((i.getUint32(232 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(232 - 8) << (32 - 19))) ^ ((i.getUint32(232 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(232 - 28) >>> 0) + ((((i.getUint32(232 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(232 - 60) << (32 - 7))) ^ (((i.getUint32(232 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(232 - 60) << (32 - 18))) ^ ((i.getUint32(232 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(232 - 64)), i.getUint32(232)); tmp[1] = ((((b[6] & 0xFFFFFFFF) >>> 2) | (b[6] << (32 - 2))) ^ (((b[6] & 0xFFFFFFFF) >>> 13) | (b[6] << (32 - 13))) ^ (((b[6] & 0xFFFFFFFF) >>> 22) | (b[6] << (32 - 22)))) + ((b[6] & b[7]) | (b[0] & (b[6] | b[7]))); b[1] += tmp[0]; b[5] = tmp[0] + tmp[1];
		tmp[0] = (((b[4] + ((((b[1] & 0xFFFFFFFF) >>> 6) | (b[1] << (32 - 6))) ^ (((b[1] & 0xFFFFFFFF) >>> 11) | (b[1] << (32 - 11))) ^ (((b[1] & 0xFFFFFFFF) >>> 25) | (b[1] << (32 - 25)))) >>> 0) + (b[3] ^ (b[1] & (b[2] ^ b[3]))) >>> 0) + 0x8CC70208 >>> 0) + (i.setUint32(236, ((((((i.getUint32(236 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(236 - 8) << (32 - 17))) ^ (((i.getUint32(236 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(236 - 8) << (32 - 19))) ^ ((i.getUint32(236 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(236 - 28) >>> 0) + ((((i.getUint32(236 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(236 - 60) << (32 - 7))) ^ (((i.getUint32(236 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(236 - 60) << (32 - 18))) ^ ((i.getUint32(236 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(236 - 64)), i.getUint32(236)); tmp[1] = ((((b[5] & 0xFFFFFFFF) >>> 2) | (b[5] << (32 - 2))) ^ (((b[5] & 0xFFFFFFFF) >>> 13) | (b[5] << (32 - 13))) ^ (((b[5] & 0xFFFFFFFF) >>> 22) | (b[5] << (32 - 22)))) + ((b[5] & b[6]) | (b[7] & (b[5] | b[6]))); b[0] += tmp[0]; b[4] = tmp[0] + tmp[1];
		tmp[0] = (((b[3] + ((((b[0] & 0xFFFFFFFF) >>> 6) | (b[0] << (32 - 6))) ^ (((b[0] & 0xFFFFFFFF) >>> 11) | (b[0] << (32 - 11))) ^ (((b[0] & 0xFFFFFFFF) >>> 25) | (b[0] << (32 - 25)))) >>> 0) + (b[2] ^ (b[0] & (b[1] ^ b[2]))) >>> 0) + 0x90BEFFFA >>> 0) + (i.setUint32(240, ((((((i.getUint32(240 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(240 - 8) << (32 - 17))) ^ (((i.getUint32(240 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(240 - 8) << (32 - 19))) ^ ((i.getUint32(240 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(240 - 28) >>> 0) + ((((i.getUint32(240 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(240 - 60) << (32 - 7))) ^ (((i.getUint32(240 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(240 - 60) << (32 - 18))) ^ ((i.getUint32(240 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(240 - 64)), i.getUint32(240)); tmp[1] = ((((b[4] & 0xFFFFFFFF) >>> 2) | (b[4] << (32 - 2))) ^ (((b[4] & 0xFFFFFFFF) >>> 13) | (b[4] << (32 - 13))) ^ (((b[4] & 0xFFFFFFFF) >>> 22) | (b[4] << (32 - 22)))) + ((b[4] & b[5]) | (b[6] & (b[4] | b[5]))); b[7] += tmp[0]; b[3] = tmp[0] + tmp[1];
		tmp[0] = (((b[2] + ((((b[7] & 0xFFFFFFFF) >>> 6) | (b[7] << (32 - 6))) ^ (((b[7] & 0xFFFFFFFF) >>> 11) | (b[7] << (32 - 11))) ^ (((b[7] & 0xFFFFFFFF) >>> 25) | (b[7] << (32 - 25)))) >>> 0) + (b[1] ^ (b[7] & (b[0] ^ b[1]))) >>> 0) + 0xA4506CEB >>> 0) + (i.setUint32(244, ((((((i.getUint32(244 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(244 - 8) << (32 - 17))) ^ (((i.getUint32(244 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(244 - 8) << (32 - 19))) ^ ((i.getUint32(244 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(244 - 28) >>> 0) + ((((i.getUint32(244 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(244 - 60) << (32 - 7))) ^ (((i.getUint32(244 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(244 - 60) << (32 - 18))) ^ ((i.getUint32(244 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(244 - 64)), i.getUint32(244)); tmp[1] = ((((b[3] & 0xFFFFFFFF) >>> 2) | (b[3] << (32 - 2))) ^ (((b[3] & 0xFFFFFFFF) >>> 13) | (b[3] << (32 - 13))) ^ (((b[3] & 0xFFFFFFFF) >>> 22) | (b[3] << (32 - 22)))) + ((b[3] & b[4]) | (b[5] & (b[3] | b[4]))); b[6] += tmp[0]; b[2] = tmp[0] + tmp[1];
		tmp[0] = (((b[1] + ((((b[6] & 0xFFFFFFFF) >>> 6) | (b[6] << (32 - 6))) ^ (((b[6] & 0xFFFFFFFF) >>> 11) | (b[6] << (32 - 11))) ^ (((b[6] & 0xFFFFFFFF) >>> 25) | (b[6] << (32 - 25)))) >>> 0) + (b[0] ^ (b[6] & (b[7] ^ b[0]))) >>> 0) + 0xBEF9A3F7 >>> 0) + (i.setUint32(248, ((((((i.getUint32(248 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(248 - 8) << (32 - 17))) ^ (((i.getUint32(248 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(248 - 8) << (32 - 19))) ^ ((i.getUint32(248 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(248 - 28) >>> 0) + ((((i.getUint32(248 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(248 - 60) << (32 - 7))) ^ (((i.getUint32(248 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(248 - 60) << (32 - 18))) ^ ((i.getUint32(248 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(248 - 64)), i.getUint32(248)); tmp[1] = ((((b[2] & 0xFFFFFFFF) >>> 2) | (b[2] << (32 - 2))) ^ (((b[2] & 0xFFFFFFFF) >>> 13) | (b[2] << (32 - 13))) ^ (((b[2] & 0xFFFFFFFF) >>> 22) | (b[2] << (32 - 22)))) + ((b[2] & b[3]) | (b[4] & (b[2] | b[3]))); b[5] += tmp[0]; b[1] = tmp[0] + tmp[1];
		tmp[0] = (((b[0] + ((((b[5] & 0xFFFFFFFF) >>> 6) | (b[5] << (32 - 6))) ^ (((b[5] & 0xFFFFFFFF) >>> 11) | (b[5] << (32 - 11))) ^ (((b[5] & 0xFFFFFFFF) >>> 25) | (b[5] << (32 - 25)))) >>> 0) + (b[7] ^ (b[5] & (b[6] ^ b[7]))) >>> 0) + 0xC67178F2 >>> 0) + (i.setUint32(252, ((((((i.getUint32(252 - 8) & 0xFFFFFFFF) >>> 17) | (i.getUint32(252 - 8) << (32 - 17))) ^ (((i.getUint32(252 - 8) & 0xFFFFFFFF) >>> 19) | (i.getUint32(252 - 8) << (32 - 19))) ^ ((i.getUint32(252 - 8) & 0xFFFFFFFF) >>> 10)) + i.getUint32(252 - 28) >>> 0) + ((((i.getUint32(252 - 60) & 0xFFFFFFFF) >>> 7) | (i.getUint32(252 - 60) << (32 - 7))) ^ (((i.getUint32(252 - 60) & 0xFFFFFFFF) >>> 18) | (i.getUint32(252 - 60) << (32 - 18))) ^ ((i.getUint32(252 - 60) & 0xFFFFFFFF) >>> 3)) >>> 0) + i.getUint32(252 - 64)), i.getUint32(252)); tmp[1] = ((((b[1] & 0xFFFFFFFF) >>> 2) | (b[1] << (32 - 2))) ^ (((b[1] & 0xFFFFFFFF) >>> 13) | (b[1] << (32 - 13))) ^ (((b[1] & 0xFFFFFFFF) >>> 22) | (b[1] << (32 - 22)))) + ((b[1] & b[2]) | (b[3] & (b[1] | b[2]))); b[4] += tmp[0]; b[0] = tmp[0] + tmp[1];

		checksum_h[0] += b[0];
		checksum_h[1] += b[1];
		checksum_h[2] += b[2];
		checksum_h[3] += b[3];
		checksum_h[4] += b[4];
		checksum_h[5] += b[5];
		checksum_h[6] += b[6];
		checksum_h[7] += b[7];
	}

	digest = new DataView(new ArrayBuffer(32));
	digest.setUint32(0, checksum_h[0]);
	digest.setUint32(4, checksum_h[1]);
	digest.setUint32(8, checksum_h[2]);
	digest.setUint32(12, checksum_h[3]);
	digest.setUint32(16, checksum_h[4]);
	digest.setUint32(20, checksum_h[5]);
	digest.setUint32(24, checksum_h[6]);
	digest.setUint32(28, checksum_h[7]);

	return new Uint8Array(digest.buffer);
};

var Key25519 = Uint8Array;
function createEmptyKey25519()
{
	return new Uint8Array(32);
}

Uint8Array.prototype.equals = function(o) {
	if (this.length != o.length) {
		return false;
	}

	var i;
	for (i=0; i<this.length; ++i) {
		if (this[i] != o[i]) {
			return false;
		}
	}
	return true;
}
// I'm too lazy to redo that radix 2^8 math, so this is just a cupypaste
// all inputs must be typed arrays

// p,q - vector (Uint8Array, offs+n in size)
// x - vector (Uint8Array, n in size)
// p = q + x * z
function mula_small(p, q, offs, x, n, z)
{
    var i, v=0;
    for (i=0; i<n; ++i) {
        v += (q[i + offs]) + z*x[i];
        p[i+offs]=v;
        v >>= 8; // SIGNED shift
    }
    return v;
}

// p - vector (Uint8Array, t+31 in size)
// x - vector (Uint8Array, 31 in size)
// y - vector (Uint8Array, t in size)
//
// p += x * y * z  where z is a small integer
// y is allowed to overlap with p+32 if you don't care about the upper half
function mula32(p, x, y, t, z)
{
	var i, n = 31, w = 0;
    for (i = 0; i < t; i++) {
        var zy = z * (y[i]);
        w += mula_small(p, p, i, x, n, zy) + p[i+n] + zy * x[n];
        p[i+n] = w;
        w >>= 8;
    }
    p[i+n] = w + p[i+n];
    return w >> 8;
}

// q,r,d - vector (Uint8Array,  in size)
// divide r (size n) by d (size t), returning quotient q and remainder r
function divmod(q, r, n, d, t)
{
    var rn = 0;
    var dt = (d[t-1]) << 8;
    if (t>1) {
		dt |= d[t-2];
	}

    while (n-- >= t)
    {
        var z = (rn << 16) | (r[n] << 8);
        if (n>0) {
			z |= r[n-1];
		}
        z = Math.floor(z/dt);
        rn += mula_small(r,r, n-t+1, d, t, -z);
        q[n-t+1] = z + rn; /* rn is 0 or -1 (underflow) */
        mula_small(r,r, n-t+1, d, t, -rn);
        rn = r[n];
        r[n] = 0;
    }
    r[t-1] = rn;
}

function numsize(x,n)
{
    while (n--!=0 && x[n]==0)
        ;
    return n+1;
}

// extended GCD on a and b
// x, y,  vector (Uint8Array, 64 in size)
// a, b,  vector (Uint8Array, 32 in size)
function egcd32(x, y, a, b)
{
    var i, an, bn = 32, qn;
    for (i = 0; i < 32; i++) {
        x[i] = y[i] = 0;
	}
    x[0] = 1;
    an = numsize(a, 32);
    if (an==0) {
        return y;	/* division by zero */
	}

    var temp = new Uint8Array(32);
    while (1)
    {
        qn = bn - an + 1;
        divmod(temp, b, bn, a, an);
        bn = numsize(b, bn);
        if (bn==0) {
	        return x;
		}
        mula32(y, x, temp, qn, -1);

        qn = an - bn + 1;
        divmod(temp, a, an, b, bn);
        an = numsize(a, an);
        if (an==0) {
	        return y;
		}
        mula32(x, y, temp, qn, -1);
    }
	return undefined;
}

// class for dealing with 64-bit integers, split into
// lo and hi part
function V64(lo, hi)
{
	this.lo = 0;
	this.hi = 0;
}

V64.prototype.set = function(lo, hi) {
	this.lo = lo;
	this.hi = hi;

	// and-ing changes sig :/
	while (this.hi > 0xffffffff) this.hi -= 0x100000000;
	while (this.lo > 0xffffffff) this.lo -= 0x100000000;
}


function mul32x32(d, i1, i2)
{
	var al = i1&0xffff; var ah = i1>>>16;
	var bl = i2&0xffff; var bh = i2>>>16;
	var A = ah*bh;
	var B = al*bl;
	var C = (al+ah)*(bl+bh);
	var K = C-A-B;

	var lo = (K&0xffff)*(1<<16) + B;
	var hi = 0;
	if (lo > 0xffffffff) {
		lo -= 0x100000000;
		hi = 1;
	}

	d.set(lo, hi+ ((A)+(K>>>16)) );
	return d;
}

// this magic method does two things
// it multiplies two 32-bit integers i1*i2
// and adds result to 'this'
function v64_addMul(i1, i2)
{
	var al = i1&0xffff; var ah = i1>>>16;
	var bl = i2&0xffff; var bh = i2>>>16;
	var A = ah*bh;
	var B = al*bl;
	var C = (al+ah)*(bl+bh);
	var K = C-A-B;

	var lo = (K&0xffff)*(1<<16) + B;
	var hi = 0;
	if (lo > 0xffffffff) {
		lo -= 0x100000000;
		hi = 1;
	}
	hi += ((A)+(K>>>16)) ;

	this.lo += lo;
	this.hi += hi;

	// and-ing changes sign, so I must do  :/
	// -= instead ;/
	if (this.lo > 0xffffffff) {
		this.hi ++;
		this.lo -= 0x100000000;
	}
	if (this.hi > 0xffffffff) this.hi -= 0x100000000;
	return this;
}

function v64_add(o)
{
	this.lo += o.lo;
	this.hi += o.hi;

	// and-ing changes sign, so I must do  :/
	// -= instead ;/
	if (this.lo > 0xffffffff) {
		this.hi ++;
		this.lo -= 0x100000000;
	}
	if (this.hi > 0xffffffff) this.hi -= 0x100000000;
	return this;
}

function shl(v, s)
{
	var v = v * (1 << s);
	while (v > 0xffffffff) { v -= 0x100000000; }
	return v;
}

// ok passed masks, are always ok to do this
function v64_and32(mask)
{
	return this.lo & mask;
}


function bor32(a,b){ return a+b; }

// if you're wondering bout that strange "*(1<<x)" it is to
// avoid eventual sign issues
function v64_shr25ret(o)
{
	o.lo = (this.lo >>> 25) + (this.hi&reduce_mask_25)*(1<<7);
	o.hi = (this.hi >>> 25);
}

function v64_shr26ret(o)
{
	o.lo = (this.lo >>> 26) + (this.hi&reduce_mask_26)*(1<<6);
	o.hi = (this.hi >>> 26);
}

function v64_shr25()
{
	return (this.lo >>> 25) + (this.hi&reduce_mask_25)*(1<<7);
}

function v64_shr26()
{
	return (this.lo >>> 26) + (this.hi&reduce_mask_26)*(1<<6);
}

V64.prototype.add = v64_add;
V64.prototype.addMul = v64_addMul;
V64.prototype.and32 = v64_and32;
V64.prototype.shr26 = v64_shr26;
V64.prototype.shr25 = v64_shr25;
V64.prototype.shr25ret = v64_shr25ret;
V64.prototype.shr26ret = v64_shr26ret;

// class for dealing with points on Curve
function Bn25519(o)
{
	if (o == undefined) {
		this.d = new Uint32Array(10);

	} else {
		this.d = new Uint32Array(o.d);
	}

	this._m0 = new V64(); this._m1 = new V64(); this._m2 = new V64(); this._m3 = new V64(); this._m4 = new V64();
	this._m5 = new V64(); this._m6 = new V64(); this._m7 = new V64(); this._m8 = new V64(); this._m9 = new V64();
}

// 2^5-2^0  --> 2^250-2^0
function specialPow(b)
{
	var t0 = new Bn25519();
	var c = new Bn25519();
	                      // 2^    - 2^
	t0.squareTimes(b, 5); //    10 -     5
	b.mul(t0, b);         //    10 -     0
	t0.squareTimes(b, 10); //   20 -     10
	c.mul(t0, b);         //    20 -     0

	t0.squareTimes(c, 20); //   40 -     20
	t0.mul(t0, c);         //   40 -     0

	t0.squareTimes(t0, 10);//   50 -     10
	b.mul(t0, b);          //   50 -     0

	t0.squareTimes(b, 50); //  100 -     50
	c.mul(t0, b);          //  100 -     0

	t0.squareTimes(c,100); //  200 -     100
	t0.mul(t0, c);         //  200 -     0

	t0.squareTimes(t0,50); //  250 -     50
	b.mul(t0, b);          //  250 -     0
}

function bn25519_recip(z)
{
	var a = new Bn25519();
	var t0 = new Bn25519();
	var b = new Bn25519();

	a.square(z); // 2
	t0.squareTimes(a, 2); // 8
	b.mul(t0, z); // 9
	a.mul(b, a); // 11
	t0.square(a); // 22
	b.mul(t0, b); // 31 = 2^5-2^0
	
	specialPow(b); // 2^250-2^0

	b.squareTimes(b, 5); // 2^250 - 2^5
	this.mul(b, a); // 2^255 - (32-11 = 21)
}

// 2^252 - 3	
function bn25519_recipSpecial(z)
{
	var a = new Bn25519();
	var t0 = new Bn25519();
	var b = new Bn25519();

	a.square(z); // 2
	t0.squareTimes(a, 2); // 8
	b.mul(t0, z); // 9
	a.mul(b, a); // 11
	t0.square(a); // 22
	b.mul(t0, b); // 31 = 2^5-2^0
	
	specialPow(b); // 2^250-2^0

	b.squareTimes(b, 2); // 2^252 - 2^2
	this.mul(b, z);      // 2^252 - (4-1 = 3)
}
 
function bn25519_vecAdd(b1, b2)
{
	var i;
	for (i=0; i<10; ++i) {
		this.d[i] = b1.d[i] + b2.d[i];
	}
}

function bn25519_sub(b1, b2) { 
	var c;
	this.d[0] = 0x7ffffda + b1.d[0] - b2.d[0]    ; c = (this.d[0] >>> 26); this.d[0] &= reduce_mask_26;
	this.d[1] = 0x3fffffe + b1.d[1] - b2.d[1] + c; c = (this.d[1] >>> 25); this.d[1] &= reduce_mask_25;
	this.d[2] = 0x7fffffe + b1.d[2] - b2.d[2] + c; c = (this.d[2] >>> 26); this.d[2] &= reduce_mask_26;
	this.d[3] = 0x3fffffe + b1.d[3] - b2.d[3] + c; c = (this.d[3] >>> 25); this.d[3] &= reduce_mask_25;
	this.d[4] = 0x7fffffe + b1.d[4] - b2.d[4] + c; c = (this.d[4] >>> 26); this.d[4] &= reduce_mask_26;
	this.d[5] = 0x3fffffe + b1.d[5] - b2.d[5] + c; c = (this.d[5] >>> 25); this.d[5] &= reduce_mask_25;
	this.d[6] = 0x7fffffe + b1.d[6] - b2.d[6] + c; c = (this.d[6] >>> 26); this.d[6] &= reduce_mask_26;
	this.d[7] = 0x3fffffe + b1.d[7] - b2.d[7] + c; c = (this.d[7] >>> 25); this.d[7] &= reduce_mask_25;
	this.d[8] = 0x7fffffe + b1.d[8] - b2.d[8] + c; c = (this.d[8] >>> 26); this.d[8] &= reduce_mask_26;
	this.d[9] = 0x3fffffe + b1.d[9] - b2.d[9] + c; c = (this.d[9] >>> 25); this.d[9] &= reduce_mask_25;
	this.d[0] += 19 * c;
}
 
function bn25519_mul_scalar(b1, scalar)
{
	var c;
	var a = this._m1;
	var b = this._m2;
	mul32x32(a, b1.d[0], scalar);        this.d[0] = a.and32(reduce_mask_26); c = a.shr26();
	b.set(c,0);
	mul32x32(a, b1.d[1], scalar).add(b); this.d[1] = a.and32(reduce_mask_25); c = a.shr25();
	b.set(c,0);
	mul32x32(a, b1.d[2], scalar).add(b); this.d[2] = a.and32(reduce_mask_26); c = a.shr26();
	b.set(c,0);
	mul32x32(a, b1.d[3], scalar).add(b); this.d[3] = a.and32(reduce_mask_25); c = a.shr25();
	b.set(c,0);
	mul32x32(a, b1.d[4], scalar).add(b); this.d[4] = a.and32(reduce_mask_26); c = a.shr26();
	b.set(c,0);
	mul32x32(a, b1.d[5], scalar).add(b); this.d[5] = a.and32(reduce_mask_25); c = a.shr25();
	b.set(c,0);
	mul32x32(a, b1.d[6], scalar).add(b); this.d[6] = a.and32(reduce_mask_26); c = a.shr26();
	b.set(c,0);
	mul32x32(a, b1.d[7], scalar).add(b); this.d[7] = a.and32(reduce_mask_25); c = a.shr25();
	b.set(c,0);
	mul32x32(a, b1.d[8], scalar).add(b); this.d[8] = a.and32(reduce_mask_26); c = a.shr26();
	b.set(c,0);
	mul32x32(a, b1.d[9], scalar).add(b); this.d[9] = a.and32(reduce_mask_25); c = a.shr25();
    this.d[0] += c * 19;
}

function bn25519_squareTimes(b1, count)
{
	var r0 = b1.d[0];
	var r1 = b1.d[1];
	var r2 = b1.d[2];
	var r3 = b1.d[3];
	var r4 = b1.d[4];
	var	r5 = b1.d[5];
	var r6 = b1.d[6];
	var r7 = b1.d[7];
	var r8 = b1.d[8];
	var r9 = b1.d[9];
	var p;

	var m0 = this._m0, m1 = this._m1, m2 = this._m2, m3 = this._m3, m4 = this._m4;
	var m5 = this._m5, m6 = this._m6, m7 = this._m7, m8 = this._m8, m9 = this._m9;

	var c = new V64();
	do {
		mul32x32(m0, r0, r0);
		r0 *= 2;
		mul32x32(m1, r0, r1);
		mul32x32(m2, r0, r2).addMul(r1, r1 * 2);
		r1 *= 2;
		mul32x32(m3, r0, r3).addMul( r1, r2    );
		mul32x32(m4, r0, r4).addMul( r1, r3 * 2).addMul( r2, r2);
		r2 *= 2;
		mul32x32(m5, r0, r5).addMul( r1, r4    ).addMul( r2, r3);
		mul32x32(m6, r0, r6).addMul( r1, r5 * 2).addMul( r2, r4).addMul( r3, r3 * 2);
		r3 *= 2;
		mul32x32(m7, r0, r7).addMul( r1, r6    ).addMul( r2, r5).addMul( r3, r4    );
		mul32x32(m8, r0, r8).addMul( r1, r7 * 2).addMul( r2, r6).addMul( r3, r5 * 2).addMul( r4, r4    );
		mul32x32(m9, r0, r9).addMul( r1, r8    ).addMul( r2, r7).addMul( r3, r6    ).addMul( r4, r5 * 2);

		var d6 = r6 * 19;
		var d7 = r7 * 2 * 19;
		var d8 = r8 * 19;
		var d9 = r9 * 2 * 19;

		m0.addMul( d9, r1    ).addMul( d8, r2    ).addMul( d7, r3    ).addMul( d6, r4 * 2).addMul( r5, r5 * 2 * 19);
		m1.addMul( d9, r2 / 2).addMul( d8, r3    ).addMul( d7, r4    ).addMul( d6, r5 * 2);
		m2.addMul( d9, r3    ).addMul( d8, r4 * 2).addMul( d7, r5 * 2).addMul( d6, r6    );
		m3.addMul( d9, r4    ).addMul( d8, r5 * 2).addMul( d7, r6    );
		m4.addMul( d9, r5 * 2).addMul( d8, r6 * 2).addMul( d7, r7    );
		m5.addMul( d9, r6    ).addMul( d8, r7 * 2);
		m6.addMul( d9, r7 * 2).addMul( d8, r8    );
		m7.addMul( d9, r8    );
		m8.addMul( d9, r9    );

									   r0 = m0.and32(reduce_mask_26); m0.shr26ret(c);
		m1.add(c);                     r1 = m1.and32(reduce_mask_25); m1.shr25ret(c);
		m2.add(c);                     r2 = m2.and32(reduce_mask_26); m2.shr26ret(c);
		m3.add(c);                     r3 = m3.and32(reduce_mask_25); m3.shr25ret(c);
		m4.add(c);                     r4 = m4.and32(reduce_mask_26); m4.shr26ret(c);
		m5.add(c);                     r5 = m5.and32(reduce_mask_25); m5.shr25ret(c);
		m6.add(c);                     r6 = m6.and32(reduce_mask_26); m6.shr26ret(c);
		m7.add(c);                     r7 = m7.and32(reduce_mask_25); m7.shr25ret(c);
		m8.add(c);                     r8 = m8.and32(reduce_mask_26); m8.shr26ret(c);
		m9.add(c);                     r9 = m9.and32(reduce_mask_25); p = m9.shr25();
		m0.set(r0,0);
		m0.addMul(p,19);               r0 = m0.and32(reduce_mask_26); p = m0.shr26();
		r1 += p;
	} while (--count);

	this.d[0] = r0;
	this.d[1] = r1;
	this.d[2] = r2;
	this.d[3] = r3;
	this.d[4] = r4;
	this.d[5] = r5;
	this.d[6] = r6;
	this.d[7] = r7;
	this.d[8] = r8;
	this.d[9] = r9;

}

function bn25519_square(b1)
{
	var r0 = b1.d[0];
	var	r1 = b1.d[1];
	var r2 = b1.d[2];
	var r3 = b1.d[3];
	var r4 = b1.d[4];
	var r5 = b1.d[5];
	var r6 = b1.d[6];
	var r7 = b1.d[7];
	var r8 = b1.d[8];
	var r9 = b1.d[9];
	var p;
	
	var m0 = this._m0, m1 = this._m1, m2 = this._m2, m3 = this._m3, m4 = this._m4;
	var m5 = this._m5, m6 = this._m6, m7 = this._m7, m8 = this._m8, m9 = this._m9;

	mul32x32(m0, r0, r0);
	r0 *= 2;
	mul32x32(m1, r0, r1);
	mul32x32(m2, r0, r2).addMul( r1, r1 * 2);
	r1 *= 2;
	mul32x32(m3, r0, r3).addMul( r1, r2    );
	mul32x32(m4, r0, r4).addMul( r1, r3 * 2).addMul( r2, r2);
	r2 *= 2;
	mul32x32(m5, r0, r5).addMul( r1, r4    ).addMul( r2, r3);
	mul32x32(m6, r0, r6).addMul( r1, r5 * 2).addMul( r2, r4).addMul( r3, r3 * 2);
	r3 *= 2;
	mul32x32(m7, r0, r7).addMul( r1, r6    ).addMul( r2, r5).addMul( r3, r4    );
	mul32x32(m8, r0, r8).addMul( r1, r7 * 2).addMul( r2, r6).addMul( r3, r5 * 2).addMul( r4, r4    );
	mul32x32(m9, r0, r9).addMul( r1, r8    ).addMul( r2, r7).addMul( r3, r6    ).addMul( r4, r5 * 2);

	var d6 = r6 * 19;
	var d7 = r7 * 2 * 19;
	var d8 = r8 * 19;
	var d9 = r9 * 2 * 19;

	m0.addMul( d9, r1    ).addMul( d8, r2    ).addMul( d7, r3    ).addMul( d6, r4 * 2).addMul( r5, r5 * 2 * 19);
	m1.addMul( d9, r2 / 2).addMul( d8, r3    ).addMul( d7, r4    ).addMul( d6, r5 * 2);
	m2.addMul( d9, r3    ).addMul( d8, r4 * 2).addMul( d7, r5 * 2).addMul( d6, r6    );
	m3.addMul( d9, r4    ).addMul( d8, r5 * 2).addMul( d7, r6    );
	m4.addMul( d9, r5 * 2).addMul( d8, r6 * 2).addMul( d7, r7    );
	m5.addMul( d9, r6    ).addMul( d8, r7 * 2);
	m6.addMul( d9, r7 * 2).addMul( d8, r8    );
	m7.addMul( d9, r8    );
	m8.addMul( d9, r9    );

	var c = new V64();
	                               r0 = m0.and32(reduce_mask_26); m0.shr26ret(c);
	m1.add(c);                     r1 = m1.and32(reduce_mask_25); m1.shr25ret(c);
	m2.add(c);                     r2 = m2.and32(reduce_mask_26); m2.shr26ret(c);
	m3.add(c);                     r3 = m3.and32(reduce_mask_25); m3.shr25ret(c);
	m4.add(c);                     r4 = m4.and32(reduce_mask_26); m4.shr26ret(c);
	m5.add(c);                     r5 = m5.and32(reduce_mask_25); m5.shr25ret(c);
	m6.add(c);                     r6 = m6.and32(reduce_mask_26); m6.shr26ret(c);
	m7.add(c);                     r7 = m7.and32(reduce_mask_25); m7.shr25ret(c);
	m8.add(c);                     r8 = m8.and32(reduce_mask_26); m8.shr26ret(c);
	m9.add(c);                     r9 = m9.and32(reduce_mask_25); p = m9.shr25();
	m0.set(r0,0);
	m0.addMul(p,19);               r0 = m0.and32(reduce_mask_26); p = m0.shr26();
	r1 += p;

	this.d[0] = r0;
	this.d[1] = r1;
	this.d[2] = r2;
	this.d[3] = r3;
	this.d[4] = r4;
	this.d[5] = r5;
	this.d[6] = r6;
	this.d[7] = r7;
	this.d[8] = r8;
	this.d[9] = r9;
}

function bn25519_mul(b1, b2)
{
	var r0 = b2.d[0];
	var	r1 = b2.d[1];
	var r2 = b2.d[2];
	var r3 = b2.d[3];
	var r4 = b2.d[4];
	var r5 = b2.d[5];
	var r6 = b2.d[6];
	var r7 = b2.d[7];
	var r8 = b2.d[8];
	var r9 = b2.d[9];

	var s0 = b1.d[0];
	var s1 = b1.d[1];
	var s2 = b1.d[2];
	var s3 = b1.d[3];
	var s4 = b1.d[4];
	var s5 = b1.d[5];
	var s6 = b1.d[6];
	var s7 = b1.d[7];
	var s8 = b1.d[8];
	var s9 = b1.d[9];
	var p;

	var m0 = this._m0, m1 = this._m1, m2 = this._m2, m3 = this._m3, m4 = this._m4;
	var m5 = this._m5, m6 = this._m6, m7 = this._m7, m8 = this._m8, m9 = this._m9;

	mul32x32(m1, r0, s1).addMul( r1, s0);
	mul32x32(m3, r0, s3).addMul( r1, s2).addMul( r2, s1).addMul( r3, s0);
	mul32x32(m5, r0, s5).addMul( r1, s4).addMul( r2, s3).addMul( r3, s2).addMul( r4, s1).addMul( r5, s0);
	mul32x32(m7, r0, s7).addMul( r1, s6).addMul( r2, s5).addMul( r3, s4).addMul( r4, s3).addMul( r5, s2).addMul( r6, s1).addMul( r7, s0);
	mul32x32(m9, r0, s9).addMul( r1, s8).addMul( r2, s7).addMul( r3, s6).addMul( r4, s5).addMul( r5, s4).addMul( r6, s3).addMul( r7, s2).addMul( r8, s1).addMul( r9, s0);

	r1 *= 2;
	r3 *= 2;
	r5 *= 2;
	r7 *= 2;

	mul32x32(m0, r0, s0);
	mul32x32(m2, r0, s2).addMul( r1, s1).addMul( r2, s0);
	mul32x32(m4, r0, s4).addMul( r1, s3).addMul( r2, s2).addMul( r3, s1).addMul( r4, s0);
	mul32x32(m6, r0, s6).addMul( r1, s5).addMul( r2, s4).addMul( r3, s3).addMul( r4, s2).addMul( r5, s1).addMul( r6, s0);
	mul32x32(m8, r0, s8).addMul( r1, s7).addMul( r2, s6).addMul( r3, s5).addMul( r4, s4).addMul( r5, s3).addMul( r6, s2).addMul( r7, s1).addMul( r8, s0);

	r1 *= 19;
	r2 *= 19;
	r3 = (r3 / 2) * 19;
	r4 *= 19;
	r5 = (r5 / 2) * 19;
	r6 *= 19;
	r7 = (r7 / 2) * 19;
	r8 *= 19;
	r9 *= 19;

	m1.addMul( r9, s2).addMul( r8, s3).addMul( r7, s4).addMul( r6, s5).addMul( r5, s6).addMul( r4, s7).addMul( r3, s8).addMul( r2, s9);
	m3.addMul( r9, s4).addMul( r8, s5).addMul( r7, s6).addMul( r6, s7).addMul( r5, s8).addMul( r4, s9);
	m5.addMul( r9, s6).addMul( r8, s7).addMul( r7, s8).addMul( r6, s9);
	m7.addMul( r9, s8).addMul( r8, s9);


	r3 *= 2;
	r5 *= 2;
	r7 *= 2;
	r9 *= 2;

	m0.addMul( r9, s1).addMul( r8, s2).addMul( r7, s3).addMul( r6, s4).addMul( r5, s5).addMul( r4, s6).addMul( r3, s7).addMul( r2, s8).addMul( r1, s9);
	m2.addMul( r9, s3).addMul( r8, s4).addMul( r7, s5).addMul( r6, s6).addMul( r5, s7).addMul( r4, s8).addMul( r3, s9);
	m4.addMul( r9, s5).addMul( r8, s6).addMul( r7, s7).addMul( r6, s8).addMul( r5, s9);
	m6.addMul( r9, s7).addMul( r8, s8).addMul( r7, s9);
	m8.addMul( r9, s9);

	var c = new V64();
	                               r0 = m0.and32(reduce_mask_26); m0.shr26ret(c);
	m1.add(c);                     r1 = m1.and32(reduce_mask_25); m1.shr25ret(c);
	m2.add(c);                     r2 = m2.and32(reduce_mask_26); m2.shr26ret(c);
	m3.add(c);                     r3 = m3.and32(reduce_mask_25); m3.shr25ret(c);
	m4.add(c);                     r4 = m4.and32(reduce_mask_26); m4.shr26ret(c);
	m5.add(c);                     r5 = m5.and32(reduce_mask_25); m5.shr25ret(c);
	m6.add(c);                     r6 = m6.and32(reduce_mask_26); m6.shr26ret(c);
	m7.add(c);                     r7 = m7.and32(reduce_mask_25); m7.shr25ret(c);
	m8.add(c);                     r8 = m8.and32(reduce_mask_26); m8.shr26ret(c);
	m9.add(c);                     r9 = m9.and32(reduce_mask_25); p = m9.shr25();
	m0.set(r0,0);
	m0.addMul(p,19);               r0 = m0.and32(reduce_mask_26); p = m0.shr26();
	r1 += p;

	this.d[0] = r0;
	this.d[1] = r1;
	this.d[2] = r2;
	this.d[3] = r3;
	this.d[4] = r4;
	this.d[5] = r5;
	this.d[6] = r6;
	this.d[7] = r7;
	this.d[8] = r8;
	this.d[9] = r9;
}

function bn25519_sqrt(b1)
{
	var t1 = new Bn25519();
	var t2 = new Bn25519();
	var v = new Bn25519();

	t1.vecAdd(b1, b1);
	v.recipSpecial(t1);
	this.square(v);
	t2.mul(t1, this);
	if (t2.d[0] == 0) {
		throw 'change -- to sub';
	}
	t2.d[0]--;
	t1.mul(v, t2);
	this.mul(b1, t1);
}

function swapIf(x, qpx, doSwap)
{
	if (doSwap) {
		var temp = x.d;
		x.d = qpx.d;
		qpx.d = temp;
	}
}

function bn25519_clone()
{
	return new Bn25519(this);
}

function bn25519_newFromInt(i)
{
	var r = new Bn25519();
	r.d[0] = 1;
	return r;
}

Bn25519.prototype.clone = bn25519_clone;
Bn25519.prototype.vecAdd = bn25519_vecAdd;
Bn25519.prototype.sub = bn25519_sub;
Bn25519.prototype.mul = bn25519_mul;
Bn25519.prototype.sqrt = bn25519_sqrt;
Bn25519.prototype.square = bn25519_square;
Bn25519.prototype.squareTimes = bn25519_squareTimes;
Bn25519.prototype.recip = bn25519_recip;
Bn25519.prototype.recipSpecial = bn25519_recipSpecial;
Bn25519.prototype.mul_scalar = bn25519_mul_scalar;
Bn25519.ONE = bn25519_newFromInt(1);

function expandToBn(key)
{
	// this does C-like cast
	var x = new Uint32Array(key.buffer, 0, 8);
	
	var o = new Bn25519()
	o.d[0] =      (                x[0]       ) & reduce_mask_26;
	o.d[1] = bor32((x[1] <<  6) , (x[0] >>> 26)) & reduce_mask_25;
	o.d[2] = bor32((x[2] << 13) , (x[1] >>> 19)) & reduce_mask_26;
	o.d[3] = bor32((x[3] << 19) , (x[2] >>> 13)) & reduce_mask_25;
	o.d[4] =      (               (x[3] >>>  6)) & reduce_mask_26;
	o.d[5] =      (               (x[4]       )) & reduce_mask_25;
	o.d[6] = bor32((x[5] <<  7) , (x[4] >>> 25)) & reduce_mask_26;
	o.d[7] = bor32((x[6] << 13) , (x[5] >>> 19)) & reduce_mask_25;
	o.d[8] = bor32((x[7] << 20) , (x[6] >>> 12)) & reduce_mask_26;
	o.d[9] =      (               (x[7] >>>  6)) & reduce_mask_26;
	return o;
}

function shrinkFromBn(b)
{
	f = b.clone();
	f.d[1] += f.d[0] >>> 26; f.d[0] &= reduce_mask_26;
	f.d[2] += f.d[1] >>> 25; f.d[1] &= reduce_mask_25;
	f.d[3] += f.d[2] >>> 26; f.d[2] &= reduce_mask_26;
	f.d[4] += f.d[3] >>> 25; f.d[3] &= reduce_mask_25;
	f.d[5] += f.d[4] >>> 26; f.d[4] &= reduce_mask_26;
	f.d[6] += f.d[5] >>> 25; f.d[5] &= reduce_mask_25;
	f.d[7] += f.d[6] >>> 26; f.d[6] &= reduce_mask_26;
	f.d[8] += f.d[7] >>> 25; f.d[7] &= reduce_mask_25;
	f.d[9] += f.d[8] >>> 26; f.d[8] &= reduce_mask_26;
	f.d[0] += 19 * (f.d[9] >>> 25); f.d[9] &= reduce_mask_25;

	f.d[1] += f.d[0] >>> 26; f.d[0] &= reduce_mask_26;
	f.d[2] += f.d[1] >>> 25; f.d[1] &= reduce_mask_25;
	f.d[3] += f.d[2] >>> 26; f.d[2] &= reduce_mask_26;
	f.d[4] += f.d[3] >>> 25; f.d[3] &= reduce_mask_25;
	f.d[5] += f.d[4] >>> 26; f.d[4] &= reduce_mask_26;
	f.d[6] += f.d[5] >>> 25; f.d[5] &= reduce_mask_25;
	f.d[7] += f.d[6] >>> 26; f.d[6] &= reduce_mask_26;
	f.d[8] += f.d[7] >>> 25; f.d[7] &= reduce_mask_25;
	f.d[9] += f.d[8] >>> 26; f.d[8] &= reduce_mask_26;
	f.d[0] += 19 * (f.d[9] >>> 25); f.d[9] &= reduce_mask_25;


	f.d[0] += 19;
	f.d[1] += f.d[0] >>> 26; f.d[0] &= reduce_mask_26;
	f.d[2] += f.d[1] >>> 25; f.d[1] &= reduce_mask_25;
	f.d[3] += f.d[2] >>> 26; f.d[2] &= reduce_mask_26;
	f.d[4] += f.d[3] >>> 25; f.d[3] &= reduce_mask_25;
	f.d[5] += f.d[4] >>> 26; f.d[4] &= reduce_mask_26;
	f.d[6] += f.d[5] >>> 25; f.d[5] &= reduce_mask_25;
	f.d[7] += f.d[6] >>> 26; f.d[6] &= reduce_mask_26;
	f.d[8] += f.d[7] >>> 25; f.d[7] &= reduce_mask_25;
	f.d[9] += f.d[8] >>> 26; f.d[8] &= reduce_mask_26;
	f.d[0] += 19 * (f.d[9] >>> 25); f.d[9] &= reduce_mask_25;


	f.d[0] += (1 << 26) - 19;
	f.d[1] += (1 << 25) - 1;
	f.d[2] += (1 << 26) - 1;
	f.d[3] += (1 << 25) - 1;
	f.d[4] += (1 << 26) - 1;
	f.d[5] += (1 << 25) - 1;
	f.d[6] += (1 << 26) - 1;
	f.d[7] += (1 << 25) - 1;
	f.d[8] += (1 << 26) - 1;
	f.d[9] += (1 << 25) - 1;


	f.d[1] += f.d[0] >>> 26; f.d[0] &= reduce_mask_26;
	f.d[2] += f.d[1] >>> 25; f.d[1] &= reduce_mask_25;
	f.d[3] += f.d[2] >>> 26; f.d[2] &= reduce_mask_26;
	f.d[4] += f.d[3] >>> 25; f.d[3] &= reduce_mask_25;
	f.d[5] += f.d[4] >>> 26; f.d[4] &= reduce_mask_26;
	f.d[6] += f.d[5] >>> 25; f.d[5] &= reduce_mask_25;
	f.d[7] += f.d[6] >>> 26; f.d[6] &= reduce_mask_26;
	f.d[8] += f.d[7] >>> 25; f.d[7] &= reduce_mask_25;
	f.d[9] += f.d[8] >>> 26; f.d[8] &= reduce_mask_26;
	f.d[9] &= reduce_mask_25;

	f.d[1] <<= 2;
	f.d[2] <<= 3;
	f.d[3] <<= 5;
	f.d[4] <<= 6;
	f.d[6] <<= 1;
	f.d[7] <<= 3;
	f.d[8] <<= 4;
	f.d[9] <<= 6;

	var o = createEmptyKey25519();
	o[0] = 0;
	o[16] = 0;
	o[ 0 +0] |= (f.d[0] & 0xff); o[ 0 +1] = ((f.d[0] >>> 8) & 0xff); o[ 0 +2] = ((f.d[0] >>> 16) & 0xff); o[ 0 +3] = ((f.d[0] >>> 24) & 0xff);
	o[ 3 +0] |= (f.d[1] & 0xff); o[ 3 +1] = ((f.d[1] >>> 8) & 0xff); o[ 3 +2] = ((f.d[1] >>> 16) & 0xff); o[ 3 +3] = ((f.d[1] >>> 24) & 0xff);
	o[ 6 +0] |= (f.d[2] & 0xff); o[ 6 +1] = ((f.d[2] >>> 8) & 0xff); o[ 6 +2] = ((f.d[2] >>> 16) & 0xff); o[ 6 +3] = ((f.d[2] >>> 24) & 0xff);
	o[ 9 +0] |= (f.d[3] & 0xff); o[ 9 +1] = ((f.d[3] >>> 8) & 0xff); o[ 9 +2] = ((f.d[3] >>> 16) & 0xff); o[ 9 +3] = ((f.d[3] >>> 24) & 0xff);
	o[12 +0] |= (f.d[4] & 0xff); o[12 +1] = ((f.d[4] >>> 8) & 0xff); o[12 +2] = ((f.d[4] >>> 16) & 0xff); o[12 +3] = ((f.d[4] >>> 24) & 0xff);
	o[16 +0] |= (f.d[5] & 0xff); o[16 +1] = ((f.d[5] >>> 8) & 0xff); o[16 +2] = ((f.d[5] >>> 16) & 0xff); o[16 +3] = ((f.d[5] >>> 24) & 0xff);
	o[19 +0] |= (f.d[6] & 0xff); o[19 +1] = ((f.d[6] >>> 8) & 0xff); o[19 +2] = ((f.d[6] >>> 16) & 0xff); o[19 +3] = ((f.d[6] >>> 24) & 0xff);
	o[22 +0] |= (f.d[7] & 0xff); o[22 +1] = ((f.d[7] >>> 8) & 0xff); o[22 +2] = ((f.d[7] >>> 16) & 0xff); o[22 +3] = ((f.d[7] >>> 24) & 0xff);
	o[25 +0] |= (f.d[8] & 0xff); o[25 +1] = ((f.d[8] >>> 8) & 0xff); o[25 +2] = ((f.d[8] >>> 16) & 0xff); o[25 +3] = ((f.d[8] >>> 24) & 0xff);
	o[28 +0] |= (f.d[9] & 0xff); o[28 +1] = ((f.d[9] >>> 8) & 0xff); o[28 +2] = ((f.d[9] >>> 16) & 0xff); o[28 +3] = ((f.d[9] >>> 24) & 0xff);

	return o;
}

// main class of the djb's Curve
function Curve25519()
{
	this.const9 = new Bn25519();
	this.const9.d[0] = 9;
	this.const39420360 = new Bn25519();
	this.const39420360.d[0] = 39420360;
	this.const486xxx = new Bn25519();
	this.const486xxx.d[0] = 9 + 486662;
}

// if generateS is true, dictionary is returned
//
function curve25519_core(n, q, generateS)
{
	var i;

	var n_qx = q.clone();
	var n_qz = Bn25519.ONE.clone();
	var qx = new Bn25519();

	var n_qp_qx = Bn25519.ONE.clone();
	var n_qp_qz = new Bn25519();
	var qp_qx = new Bn25519();
	var qqx = new Bn25519();
	var zzz = new Bn25519();
	var zmone;

	var lastbit = 1;
	var bit;
	for (i = 253; i >= -1; i--) {
		// prep
		qx.vecAdd(n_qx, n_qz);
		n_qz.sub(n_qx, n_qz);

		// prep
		qp_qx.vecAdd(n_qp_qx, n_qp_qz);
		n_qp_qz.sub(n_qp_qx, n_qp_qz);

		// add
		n_qp_qx.mul(qp_qx, n_qz);
		n_qp_qz.mul(qx, n_qp_qz);
		qqx.vecAdd(n_qp_qx, n_qp_qz);
		n_qp_qz.sub(n_qp_qx, n_qp_qz);
		n_qp_qz.square(n_qp_qz);
		n_qp_qx.square(qqx);
		n_qp_qz.mul(n_qp_qz, q);

		// dbl
		qx.square(qx);
		n_qz.square(n_qz);
		n_qx.mul(qx, n_qz);
		n_qz.sub(qx, n_qz);
		zzz.mul_scalar(n_qz, 121665);
		zzz.vecAdd(zzz, qx);
		n_qz.mul(n_qz, zzz);

		bit = (n[Math.floor(i/8)] >>> (i & 7)) & 1;
		swapIf(n_qx, n_qp_qx, bit ^ lastbit);
		swapIf(n_qz, n_qp_qz, bit ^ lastbit);
		lastbit = bit;

	}
	/*
	for (i = 0; i < 3; i++) {
		qx.vecAdd(n_qx, n_qz);
		n_qz.sub(n_qx, n_qz);
		qx.square(qx);
		n_qz.square(n_qz);
		n_qx.mul(qx, n_qz);
		n_qz.sub(qx, n_qz);
		zzz.mul_scalar(n_qz, 121665);
		zzz.vecAdd(zzz, qx);
		n_qz.mul(n_qz, zzz);
	}*/

	zmone = new Bn25519();
	zmone.recip(n_qz);
	n_qz.mul(n_qx, zmone);

	var s;
	if (generateS) {
		var TEMPDX = new Bn25519(n_qz);
		var t = new Bn25519();
		var t2 = new Bn25519();
		var t3 = new Bn25519();
		var y2 = new Bn25519();

		t.square(TEMPDX);
		y2.mul_scalar(TEMPDX, 486662);
		t.vecAdd(t, y2);
		t.d[0] += 1; // t.vecAdd(t, {1,0...});
		y2.mul(t, TEMPDX);

		zmone.recip(n_qp_qz);
		t2.mul(n_qp_qx, zmone);

		t2.vecAdd(t2, TEMPDX);

		t2.d[0] += 9 + 486662; // t.vecAdd(t, {1,0...});
		TEMPDX.sub(TEMPDX, this.const9);

		t3.square(TEMPDX);
		TEMPDX.mul(t2, t3);
		TEMPDX.sub(TEMPDX, y2);

		TEMPDX.sub(TEMPDX, this.const39420360);

		var BASER2Y=expandToBn(new Key25519([112, 22, 0, 64, 25, 242, 105, 211, 72, 34, 69, 72, 154, 103, 77, 136, 25, 93, 191, 22, 116, 218, 125, 229, 83, 94, 5, 55, 38, 53, 192, 23]));
		y2.mul(TEMPDX, BASER2Y);
		
		// if you're wondering why this statment is simple in comparison with
		// nxt implementation, my answer is - representation

		if ((y2.d[0] & 1) != 0) {
			s = new Key25519(n);

		} else {
			var ORDER8 = new Uint8Array([104, 159, 174, 231, 210, 24,  147, 192, 178, 230, 188, 23, 245, 206, 247, 166, 0,   0,   0,   0,  0,   0,   0,   0, 0,   0,   0,   0,  0,   0,   0,   128]);
			s = createEmptyKey25519();
			mula_small(s, ORDER8, 0, n, 32, -1);
		}

		var ORDER = new Uint8Array([237, 211, 245, 92, 26,  99,  18,  88, 214, 156, 247, 162, 222, 249, 222, 20, 0,   0,   0,   0, 0,   0,   0,   0, 0,   0,   0,   0, 0,   0,   0,   16]);
		var temp1 = new Uint8Array(ORDER);

		var t1 = new Uint8Array(64);
		var t2 = new Uint8Array(64);
		var out = egcd32(t1, t2, s, temp1);

		s = new Key25519(out.buffer, 0, 32);

		if ((s[31] & 0x80)!=0)
			mula_small(s, s, 0, ORDER, 32, 1);
	}

	return { publicKey : n_qz, s: s};
}

function curve25519_sign(h, x, sess)
{
	var v = new Uint8Array(32);
	mula_small(v, x, 0, h, 32, -1);

	var val = v[31];
	if (val > 127) val -= 256;
	val = 15-val;
	if (val > 0) {
		val = Math.floor(val/16);
	} else {
		val = Math.ceil(val/16);
	}

	var ORDER = new Uint8Array([237, 211, 245, 92, 26,  99,  18,  88, 214, 156, 247, 162, 222, 249, 222, 20, 0,   0,   0,   0, 0,   0,   0,   0, 0,   0,   0,   0, 0,   0,   0,   16]);
	mula_small(v, v, 0, ORDER, 32, val);

	var temp = new Uint8Array(65);
	var temp2 = new Uint8Array(33);
	mula32(temp, v, sess, 32, 1);
	divmod(temp2, temp, 64, ORDER, 32);

	var temp2 = new Uint8Array(temp.buffer, 0, 32);

	return [temp2, h]
}

function curve25519_clamp(priv)
{
	priv[0] &= 0xf8;
	priv[31] &= 0x7f;
	priv[31] |= 0x40; 
}

function curve25519_scarmult(priv, basepointInKeyFormat, generateS)
{
	// warning: modifies priv in place
	this.clamp(priv);
	var q = expandToBn(basepointInKeyFormat);
	var r = this.core(priv, q, generateS);
	q = r.publicKey;
	var s = r.s;

	var keyPub = shrinkFromBn(q);
	return { key : keyPub, s: s };
}

function curve25519_genShared(aSecret, bPublic)
{
	return this.scarmult(aSecret, bPublic, false);
}

function curve25519_genPub(priv)
{
	var basepoint = new Key25519([9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	return this.scarmult(priv, basepoint, false);
}

function curve25519_genPubWithS(priv)
{
	var basepoint = new Key25519([9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	return this.scarmult(priv, basepoint, true);
}

// Y = v abs(P) + h G
function curve25519_verify(v, h, P)
{
	//p[0]
	var basepoint = new Key25519([9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	var p0=expandToBn(basepoint);
	var p1=expandToBn(P);
	
	var t1 = [new Bn25519(), new Bn25519(), new Bn25519()];
	var t2 = [new Bn25519(), new Bn25519(), new Bn25519()];
	var s0 = new Bn25519(), s1 = new Bn25519();
	var t = new Bn25519();

	t.square(p1);
	t2[0].mul_scalar(p1, 486662);
	t.vecAdd(t, t2[0]);
	t.d[0] += 1; // t.vecAdd(t, {1,0...});
	t2[0].mul(t, p1);
	t1[0].sqrt(t2[0]);
	
	var BASE_2Y = expandToBn(new Key25519([59, 88, 98, 2, 187, 116, 44, 172, 155, 60, 7, 37, 3, 101, 133, 219, 102, 93, 110, 17, 167, 69, 194, 63, 150, 242, 190, 142, 188, 204, 163, 62]));

	t2[0].d[0] += 39420360;
	t2[1].mul(BASE_2Y, t1[0]);
	
	if ((t1[0].d[0]&1) == 1) {
		t1[1].sub(t2[0], t2[1]);
		t1[0].vecAdd(t2[0], t2[1]);

	} else {
		t1[0].sub(t2[0], t2[1]);
		t1[1].vecAdd(t2[0], t2[1]);
	}

	t2[0] = p1.clone();
	t2[0].sub(t2[0], this.const9);
	t2[1].square(t2[0]);
	t2[0].recip(t2[1]);

	s0.mul(t1[0], t2[0]);
	s0.sub(s0, p1);
	s0.sub(s0, this.const486xxx);


	s1.mul(t1[1], t2[0]);
	s1.sub(s1, p1);
	s1.sub(s1, this.const486xxx);
	
	var vi=0, hi=0;
	var di, nvh;
	var d = new Uint8Array(32);
	for (i = 0; i < 32; i++) {
		vi = (vi >> 8) ^ (v[i]) ^ ((v[i]) << 1);
		hi = (hi >> 8) ^ (h[i]) ^ ((h[i]) << 1);
		nvh = ~(vi ^ hi);
		di = (nvh & (di & 0x80) >> 7) ^ vi;
		di ^= nvh & (di & 0x01) << 1;
		di ^= nvh & (di & 0x02) << 1;
		di ^= nvh & (di & 0x04) << 1;
		di ^= nvh & (di & 0x08) << 1;
		di ^= nvh & (di & 0x10) << 1;
		di ^= nvh & (di & 0x20) << 1;
		di ^= nvh & (di & 0x40) << 1;
		d[i] = di;
	}
	var di = ((nvh & (di & 0x80) << 1) ^ vi) >> 8;

	// yx0,yx1,yx2, yz0,yz1,yz2
	var yx0	= Bn25519.ONE.clone();
	var yx1;
	if (di == 1) {
		yx1 = p1.clone();
	} else {
		yx1 = p0.clone();
	}
	var yx2 = s0.clone();
	var yz0 = new Bn25519();
	var yz1	= Bn25519.ONE.clone();
	var yz2	= Bn25519.ONE.clone();

	var i,j,k;
	vi = 0;
	hi = 0;
	for (i = 31; i > -1; --i)
	{
		vi = (vi << 8) | (v[(i)] );
		hi = (hi << 8) | (h[(i)] );
		di = (di << 8) | (d[(i)] );

		for (j = 7; j >- 1; --j)
		{	
			// prep
			t1[0].vecAdd(yx0, yz0);
			t2[0].sub(yx0, yz0);
			//prep
			t1[1].vecAdd(yx1, yz1);
			t2[1].sub(yx1, yz1);
			//prep
			t1[2].vecAdd(yx2, yz2);
			t2[2].sub(yx2, yz2);

			k = ((vi ^ vi >> 1) >> j & 1) + ((hi ^ hi >> 1) >> j & 1);
			yx2.square(t1[k]);
			yz2.square(t2[k]);
			yx0.mul(yx2, yz2);
			yz2.sub(yx2, yz2);
			yz0.mul_scalar(yz2, 121665);
			yx2.vecAdd(yx2, yz0);
			yz0.mul(yx2, yz2);

			k = (di >> j & 2) ^ ((di >> j & 1) << 1);
			yx1.mul(t2[1], t1[k]);
			yz1.mul(t1[1], t2[k]);
			t1[1].vecAdd(yx1, yz1);
			t2[1].sub(yx1, yz1);
			yx1.square(t1[1]);
			t1[1].square(t2[1]);
			if ( ((di >> j) & 1) == 1 ) {
				yz1.mul(t1[1], p1);

			} else {
				yz1.mul(t1[1], p0);
			}

			yx2.mul(t2[2], t1[0]);
			yz2.mul(t1[2], t2[0]);
			t1[2].vecAdd(yx2, yz2);
			t2[2].sub(yx2, yz2);
			yx2.square(t1[2]);
			t1[2].square(t2[2]);
			if (((vi ^ hi) >> j & 2) == 2) {
				yz2.mul(t1[2], s1);

			} else {
				yz2.mul(t1[2], s0);
			}

		}
	}

	k = (vi & 1) + (hi & 1);
	if (k == 2) {
		t1[0].recip(yz2);
		t1[1].mul(yx2, t1[0]);
	} else if (k == 1) {
		t1[0].recip(yz1);
		t1[1].mul(yx1, t1[0]);
	} else {
		t1[0].recip(yz0);
		t1[1].mul(yx0, t1[0]);
	}

	return shrinkFromBn(t1[1]);
}

Curve25519.prototype.clamp = curve25519_clamp;
Curve25519.prototype.core = curve25519_core;
Curve25519.prototype.scarmult = curve25519_scarmult;
Curve25519.prototype.genPub = curve25519_genPub;
Curve25519.prototype.genPubWithS = curve25519_genPubWithS;
Curve25519.prototype.genShared = curve25519_genShared;
Curve25519.prototype.sign = curve25519_sign;
Curve25519.prototype.verify = curve25519_verify;

function Crypto()
{
	this.c = new Curve25519();
}

function crypto_getPublicKey(passphrase)
{
	var wrapper = new Uint8Array(passphrase);
	var privKey = SHA256(wrapper.buffer);
	return this.c.genPub(privKey).key;
}

function crypto_sign(passphrase, message)
{
	var wrapper = new Uint8Array(passphrase);
	var privKey = SHA256(wrapper.buffer);

	var pubAndS = this.c.genPubWithS(privKey);
	var sess = pubAndS.s;

	var msgWrapper = new Uint8Array(message);
	var messageHash = SHA256(msgWrapper.buffer, 0, msgWrapper.length);

	var h2 = new Uint8Array(64);
	h2.set(messageHash, 0);
	h2.set(sess, 32);
	var x = SHA256(h2.buffer, 0, h2.length);
	var Y = this.c.genPub(x).key;

	//h2.set(messageHash, 0);
	h2.set(Y, 32);
	// h = hash(m | Y)
	var h = SHA256(h2.buffer, 0, h2.length);
	var vh = this.c.sign(h, x, sess);

	h2.set(vh[0], 0);
	h2.set(vh[1], 32);
	return {sig: h2, key: pubAndS.key};
}
function crypto_verify(sig, message, key)
{
	var msgWrapper = new Uint8Array(message);
	var messageHash = SHA256(msgWrapper.buffer, 0, msgWrapper.length);
	var sigV = new Uint8Array(sig.buffer, 0, 32);
	var sigH = new Uint8Array(sig.buffer, 32, 32);
	var cofirmation = this.c.verify(sigV, sigH, key);

	var h2 = new Uint8Array(64);
	h2.set(messageHash, 0);
	h2.set(cofirmation, 32);
	var h_verify = SHA256(h2.buffer, 0, h2.length);
	return h_verify.equals(sigH);
}

Crypto.prototype.getPublicKey = crypto_getPublicKey;
Crypto.prototype.sign = crypto_sign;
Crypto.prototype.verify = crypto_verify;


curve25519nxt
=============

Curve 25519 javascript implementation

The implementation is port of wonderful stuff that floodyberry did to tune up "donna" implmentation.

Original donna can be found here:
https://github.com/agl/curve25519-donna

Floodyberry's implementaton can be found here:
https://github.com/floodyberry/curve25519-donna

My JS port requires typed arrays support.

Sign/validate is based on "xmath's" EC-KCDSA code from sci.crypt (which is what Nxt implementation uses).

Crypto object api
-----------------

Crypto object is just a wrapper for CryptoImpl object, to fulfill requirements of the bounty.
All arguments and returned values have the form of hexstrings.

c = new Crypto();

* signature = c.sign(pass, message)
* isOk = c.verify(sigature, message, signersPublicKey)
* pubKey = c.getPublicKey(pass)

Keep in mind: Sign could be **TWICE** as fast, if signer's public key was cached!
(sign first has to generate *user's PK* from pass, than generate *Signature's PK*, these operations are time consuming)

### Examples

Signing.
```javascript
var c = new Crypto();

// 'nxt'
var privKey = '6e7874';
var message = '5768617420676f657320726f756e642c20636f6d65732061726f756e642e';
var sigPub = c.sign(privKey, message);
```

Verifying
```javascript
var c = new Crypto();

var pk='7c3ff12215636a7b246dea25d5e446a91fa59a9150c6ed50d8126ee86a648b68';
var msg='0000a9d63800a0057c3ff12215636a7b246dea25d5e446a91fa59a9150c6ed50d8126ee86a648b687e2fad81dbf18f2da086010064000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
var sig='4f0626ccd4edebb17e9d06e928b5b4e944aa7ef88a111081919794a3e265c206f9d9b0ce42a8d2e7f6d902a172159bcd39dcaab8468373258fccea9e5d2ed319'

var isOk = c.verify(sig, msg, pk);
```

Public Key (probably shouldn't be used, as most times, you'll have signer's key somewhere already)
```javascript
var c = new Crypto();

var privKey = '6e7874';
var message = '5768617420676f657320726f756e642c20636f6d65732061726f756e642e';
var sigPub = 'b4cafe10e21676c4642354cba102243f0138b798af689ea51576a77b9013790b2b9d6470737f748e4bf449eecfee790f483dd894f17bf9a287120b6906228746';

var key = c.getPublicKey(privKey);

var isOk = c.verify(sigPub, message, key);

```

### Results on my machine

Time for **100** signs / verify given in ms.

Keep in mind that 'sign' operation itself is very fast, what is slow are two calls to curve.

|platform | Opera 19 | Chrome 32 | FF 26 |
|---------|----------|-----------|-------|
|sign     | 1489     | 1481      | 1634  |
|verify   | 1199     | 1199      | 1098  |

CryptoImpl object api
---------------------

c = new CryptoImpl();

* res = c.getPublicKey(pass)
  * pass - array with byte values
  * res - public key, 32b Uint8Array
* res = c.sign(pass, message)
  * pass - array with byte values
  * message - array with byte values
  * x
  * res.sig - 64b Uint8Array
  * res.key - public key, 32b Uint8Array
* res = c.verify(sig, message, publicKey)
  * sig - 64b Uint8Array as returned by .sign()
  * message - array with byte values
  * publicKey - 32b Uint8Array, from .getPublicKey() or .sign() whichever is more convenient


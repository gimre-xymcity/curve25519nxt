curve25519nxt
=============

Curve 25519 javascript implementation

requires typed arrays support.

api
---

* Crypto object
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


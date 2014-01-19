curve25519nxt
=============

Curve 25519 javascript implementation

requires typed arrays support.

Crypto object api
-----------------

Crypto object is just a wrapper for CryptoImpl object, to fulfill requirements of the challenge.
All arguments and returned values have the form of hexstrings.

c = new Crypto();

* signature = c.sign(pass, message)
* isOk = c.verify(sigature, message, signersPublicKey)
* pubKey = c.getPublicKey(pass)

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


function getGlobalProperties(prefix) {
  var keyValues = [], global = window; // window for browser environments
  for (var prop in global) {
    if (prop.indexOf(prefix) == 0) {
	  if (prefix.length == 0) {
        keyValues.push(prop);
	  } else {
        keyValues.push(prop + "=" + global[prop]);
	  }
	}
  }
  return keyValues.join('\n'); // build the string
}


function curveSelfTest()
{
	var q = new Curve25519();

	var alicePriv = new Key25519([210, 196, 255, 153, 6, 54, 138, 84, 232, 24, 222, 198, 233, 178, 192, 61, 46, 110, 249, 92, 37, 250, 62, 206, 16, 71, 242, 136, 153, 234, 194, 151]);
	var alicePub = q.genPub(alicePriv).key;

	var bobPriv = new Key25519([224, 226, 125, 230, 14, 65, 192, 136, 157, 1, 171, 29, 142, 9, 166, 121, 164, 49, 96, 117, 250, 243, 249, 14, 244, 143, 110, 64, 63, 127, 106, 188]);
	var bobPub = q.genPub(bobPriv).key;

	//  generate shared pass, those two must match
	var sh1 = q.genShared(alicePriv, bobPub).key;
	var sh2 = q.genShared(bobPriv, alicePub).key;

	var i;
	if (! sh1.equals(sh2)) {
		throw "shared secret mismatch!";
	} else {
		console.log('curveSelfTest : ok');
	}
}

function test1()
{
	var c = new Crypto();
	// 'nxt'
	var privKey = new Key25519([110, 120, 116]);
	var message = new Uint8Array([87, 104, 97, 116, 32, 103, 111, 101, 115, 32, 114, 111, 117, 110, 100, 44, 32, 99, 111, 109, 101, 115, 32, 97, 114, 111, 117, 110, 100, 46]);
	console.time('sign+verify time');
	console.time('sign time');
	var sigPub = c.sign(privKey, message);
	console.timeEnd('sign time');
	

	console.time('verify time');
	var isOk = c.verify(sigPub.sig, message, sigPub.key); 
	console.timeEnd('verify time');
	console.timeEnd('sign+verify time');

	console.log(' verified? ', isOk);
}

function test2()
{
	var privKey = new Key25519([78, 88, 84]);
	var messages = [];
	var i, j;
	for (i = 0; i < 20; ++i) {
		var msg = [];
		for (j = 0; j < 64; ++j) {
			msg.push(Math.floor( 255*Math.random() ));
		}
		messages.push(msg);
	}

	var sigs = [];
	var c = new Crypto();
	console.log('doing 20 signs');
	console.time('sigs20');
	for (i = 0; i < 20; ++i) {
		var sigPub = c.sign(privKey, messages[i]);
		sigPub.msg = messages[i];
		sigs.push(sigPub);
	}
	console.timeEnd('sigs20');

	var verifies = []
	console.log('doing 20 verifies');
	console.time('verify20');
	for (i = 0; i < 20; ++i) {
		verifies.push( c.verify(sigs[i].sig, sigs[i].msg, sigs[i].key) );
	}
	console.timeEnd('verify20');
	console.log(verifies.join());
}

function test3jaguar()
{
	var i;
	var q = new Curve25519();
	console.time('testCurveKeygen');
	for (i = 0; i < testCurveKeygen.length; ++i)
	{
		var rec = testCurveKeygen[i];
		var key = new Key25519(rec.k);
		var res = q.genPubWithS(key);
		if (! res.key.equals(rec.P)) {
			console.log('key mismatch in testcase', i);
		}
		if (! res.s.equals(rec.s)) {
			console.log('s mismatch in testcase', i);
		}
	}
	console.timeEnd('testCurveKeygen');
	console.time('testCurveSign');
	for (i = 0; i < testCurveSign.length; ++i)
	{
		var rec = testCurveSign[i];
		var h = new Uint8Array(rec.h);
		var x = new Uint8Array(rec.x);
		var s = new Uint8Array(rec.s);
		var res = q.sign(h,x,s);
		if (! res[0].equals(rec.v)) {
			console.log('v mismatch in testcase', i);
		}
		if (! res[1].equals(rec.h)) {
			console.log('h mismatch in testcase', i);
		}
	}
	console.timeEnd('testCurveSign');
	console.time('testCurveVerify');
	for (i = 0; i < testCurveVerify.length; ++i)
	{
		var rec = testCurveVerify[i];
		var v = new Uint8Array(rec.v);
		var h = new Uint8Array(rec.h);
		var P = new Uint8Array(rec.P);
		var res = q.verify(v,h,P);
		if (! res.equals(rec.Y)) {
			console.log('v mismatch in testcase', i);
			break;
		}
	}
	console.timeEnd('testCurveVerify');
}

function test4jaguar()
{
	var c = new Crypto();
	console.time('testCryptoKey');
	for (i = 0; i < testCryptoKey.length; ++i)
	{
		var rec = testCryptoKey[i];
		var p = rec.p;
		var res = c.getPublicKey(p);
		if (! res.equals(rec.k)) {
			console.log('v mismatch in testcase', i);
			break;
		}
	}
	console.timeEnd('testCryptoKey');
	console.time('testCryptoSign');
	for (i = 0; i < testCryptoSign.length; ++i)
	{
		var rec = testCryptoSign[i];
		var p = rec.p;
		var m = rec.m;
		var res = c.sign(p, m);
		if (! res.sig.equals(rec.s)) {
			console.log('v mismatch in testcase', i);
			break;
		}
	}
	console.timeEnd('testCryptoSign');
}

function testEc()
{
	curveSelfTest();
	//console.log(getGlobalProperties(''));

	test1();
	test2();
	test3jaguar();
	test4jaguar();
}

window.onload = testEc;


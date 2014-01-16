from os import path

def toint(x):
	return int(x, 16)

o=open('testSet.js', 'w')
o.close()

def convert(fname, name, desc):
	f=open(path.join('data', fname + '.dat'), 'r')
	o=open('testSet.js', 'a')
	print >>o, name,"= ["
	lineNo = 0
	for l in f:
		v = l[1:3]
		if v != ': ':
			continue
		v = l[0]
		if v == desc[0]:
			print >>o, "  { // ", lineNo
			lineNo = lineNo +1
		if desc.find(v) != -1:
			temp=l[3:].strip().split(' ')
			if len(temp) == 1: # string
				print >>o, "    ",v, ":", map(ord, l[3:].strip()),  ", // ", l[3:].strip()
			else:
				print >>o, "    ",v, ":", map(toint, temp), ","
		if v == desc[-1]:
			print >>o, "  },"

	print >>o, "];"
	f.close()
	o.close()

convert('keygenTest', 'testCurveKeygen', 'kPs')
convert('signtest', 'testCurveSign', 'vhxs')
convert('verifytest', 'testCurveVerify', 'YvhP')

convert('cryptopublickeytest', 'testCryptoKey', 'pk')
convert('cryptosigntest', 'testCryptoSign', 'pms')


(function($){
	$(document).ready(function(){
		
		QUnit.module("Basics");
		QUnit.test("Plugboard is available", function(assert){
			assert.ok(Plugboard, "Plugboard exists");
			var plugboard = new Plugboard();
			assert.ok(Plugboard.prototype.isPrototypeOf(plugboard), "Instantiated Plugboard");
		});
		QUnit.test("Static Rotor is available", function(assert){
			assert.ok(StaticRotor, "Static Rotor exists");
			var static_rotor = new StaticRotor();
			assert.ok(StaticRotor.prototype.isPrototypeOf(static_rotor), "Instantiated StaticRotor");
		});
		QUnit.test("Rotor is available", function(assert){
			assert.ok(Rotor, "Rotor exists");
			var rotor = new Rotor();
			assert.ok(Rotor.prototype.isPrototypeOf(rotor), "Instantiated Rotor");
		});
		QUnit.test("Reflector Wheel is available", function(assert){	
			assert.ok(ReflectorWheel, "ReflectorWheel exists");
			var reflector_wheel = new ReflectorWheel();
			assert.ok(ReflectorWheel.prototype.isPrototypeOf(reflector_wheel), "Instantiated Reflector Wheel");
		});		
		QUnit.test("EnigmaMachine is available", function(assert){
			assert.ok(EnigmaMachine, "EnigmaMachine exists");
			var enigma_machine = new EnigmaMachine();
			assert.ok(EnigmaMachine.prototype.isPrototypeOf(enigma_machine), "Instantiated Enigma Machine");
		});

		QUnit.module("Plugboard");	
		QUnit.test("It translates letters based on pair settings", function(assert){	
			var plugboard = new Plugboard();
			assert.equal(plugboard.translate('A'), 'A', "Plugboard with no pairs translates a letter to itself");
			plugboard = new Plugboard(['AZ']);
			assert.equal(plugboard.translate('A'), 'Z', "Plugboard with pair [AZ] translates letter A to letter Z");
			assert.equal(plugboard.translate('Z'), 'A', "Plugboard with pair [AZ] translates letter Z to letter A");
		});	
		QUnit.test("Pairs can be specified in the constructor", function(assert){	
			var plugboard = new Plugboard(['AZ']);
			assert.deepEqual(plugboard.pairs, {'A': 'Z', 'Z': 'A'}, "Single Pair");
			plugboard = new Plugboard(['AZ', 'BC']);
			assert.deepEqual(plugboard.pairs, {'A': 'Z', 'Z': 'A', 'B': 'C', 'C': 'B'}, "Two Pairs");
		});	
		
		QUnit.module("Static Rotor");
		QUnit.test("It converts letters to wire positions", function(assert){
			var static_rotor = new StaticRotor();
			assert.equal(static_rotor.letterToWire('A'), 0, "It converts letter A to wire position 0");
			assert.equal(static_rotor.letterToWire('F'), 5, "It converts letter F to wire position 5");
			assert.equal(static_rotor.letterToWire('T'), 19, "It converts letter T to wire position 19");
			assert.equal(static_rotor.letterToWire('Y'), 24, "It converts letter Y to wire position 24");
		});
		QUnit.test("It converts wire positions to letters", function(assert){
			var static_rotor = new StaticRotor();
			assert.equal(static_rotor.wireToLetter(0), 'A', "It converts wire position 0 to letter A");
			assert.equal(static_rotor.wireToLetter(5), 'F', "It converts wire position 5 to letter F");
			assert.equal(static_rotor.wireToLetter(19), 'T', "It converts wire position 19 to letter T");
			assert.equal(static_rotor.wireToLetter(24), 'Y', "It converts wire position 24 to letter Y");
		});		
		
		QUnit.module("Rotor");
		QUnit.test("Translation model is specified in the constructor", function(assert){
			var rotor = new Rotor('I');
			assert.deepEqual(rotor.encipher_map, 'EKMFLGDQVZNTOWYHXUSPAIBRCJ'.split(''), "Rotor I has translation model EKMFLGDQVZNTOWYHXUSPAIBRCJ");
			rotor = new Rotor('II');
			assert.deepEqual(rotor.encipher_map, 'AJDKSIRUXBLHWTMCQGZNPYFVOE'.split(''), "Rotor II has translation model AJDKSIRUXBLHWTMCQGZNPYFVOE");
			rotor = new Rotor('III');
			assert.deepEqual(rotor.encipher_map, 'BDFHJLCPRTXVZNYEIWGAKMUSQO'.split(''), "Rotor III has translation model BDFHJLCPRTXVZNYEIWGAKMUSQO");
			rotor = new Rotor('IV');
			assert.deepEqual(rotor.encipher_map, 'ESOVPZJAYQUIRHXLNFTGKDCMWB'.split(''), "Rotor IV has translation model ESOVPZJAYQUIRHXLNFTGKDCMWB");
			rotor = new Rotor('V');
			assert.deepEqual(rotor.encipher_map, 'VZBRGITYUPSDNHLXAWMJQOFECK'.split(''), "Rotor V has translation model VZBRGITYUPSDNHLXAWMJQOFECK");
			rotor = new Rotor('VI');
			assert.deepEqual(rotor.encipher_map, 'JPGVOUMFYQBENHZRDKASXLICTW'.split(''), "Rotor VI has translation model JPGVOUMFYQBENHZRDKASXLICTW");
			rotor = new Rotor('VII');
			assert.deepEqual(rotor.encipher_map, 'NZJHGRCXMYSWBOUFAIVLPEKQDT'.split(''), "Rotor VII has translation model NZJHGRCXMYSWBOUFAIVLPEKQDT");
			rotor = new Rotor('VIII');
			assert.deepEqual(rotor.encipher_map, 'FKQHTLXOCBJSPDZRAMEWNIUYGV'.split(''), "Rotor VIII has translation model FKQHTLXOCBJSPDZRAMEWNIUYGV");
			rotor = new Rotor('Beta');
			assert.deepEqual(rotor.encipher_map, 'LEYJVCNIXWPBQMDRTAKZGFUHOS'.split(''), "Rotor Beta has translation model LEYJVCNIXWPBQMDRTAKZGFUHOS");
			rotor = new Rotor('Gamma');
			assert.deepEqual(rotor.encipher_map, 'FSOKANUERHMBTIYCWLQPZXVGJD'.split(''), "Rotor Gamma has translation model FSOKANUERHMBTIYCWLQPZXVGJD");
		});
		QUnit.test("It enciphers from right to left", function(assert){	
			var rotor = new Rotor('I');
			assert.equal(rotor.encipher(0), 4, "Rotor model I enciphers 0 to 4");
			assert.equal(rotor.encipher(4), 11, "Rotor model I enciphers 4 to 11");
			assert.equal(rotor.encipher(1), 10, "Rotor model I enciphers 1 to 10");
			assert.equal(rotor.encipher(25), 9, "Rotor model I enciphers 25 to 9");
			assert.equal(rotor.encipher(9), 25, "Rotor model I enciphers 9 to 25");
		});
		QUnit.test("It deciphers from left to right", function(assert){	
			var rotor = new Rotor('I');
			assert.equal(rotor.decipher(4), 0, "Rotor model I deciphers 4 to 0");
			assert.equal(rotor.decipher(11), 4, "Rotor model I deciphers 11 to 4");
			assert.equal(rotor.decipher(10), 1, "Rotor model I deciphers 10 to 1");
			assert.equal(rotor.decipher(9), 25, "Rotor model I deciphers 9 to 25");
			assert.equal(rotor.decipher(25), 9, "Rotor model I deciphers 25 to 9");
		});
		QUnit.test("It may take a ground setting (initial deflection) in the constructor", function(assert){
			var rotor = new Rotor('I');
			assert.equal(rotor.deflection, 0, "Deflection is 0 if not specified in the constructor");
			rotor = new Rotor('I', 20);
			assert.equal(rotor.deflection, 20, "Deflection is set to 20 in constructor");
		});		
		QUnit.test("It can be deflected through rotations", function(assert){	
			var rotor = new Rotor('I', 1);
			assert.equal(rotor.encipher(0), 9, "Rotor model I with deflection 1 enciphers 0 to 9");
			assert.equal(rotor.decipher(9), 0, "Rotor model I with deflection 1 deciphers 9 to 0");
			assert.equal(rotor.encipher(25), 3, "Rotor model I with deflection 1 enciphers 25 to 3");
			assert.equal(rotor.decipher(3), 25, "Rotor model I with deflection 1 deciphers 3 to 25");
			rotor.deflection = 25;
			assert.equal(rotor.encipher(0), 10, "Rotor model I with deflection 25 enciphers 0 to 10");
			assert.equal(rotor.decipher(10), 0, "Rotor model I with deflection 25 deciphers 10 to 0");
			assert.equal(rotor.encipher(25), 3, "Rotor model I with deflection 25 enciphers 25 to 3");
			assert.equal(rotor.decipher(3), 25, "Rotor model I with deflection 25 deciphers 3 to 25");
			rotor.deflection = 5;
			assert.equal(rotor.encipher(0), 1, "Rotor model I with deflection 5 enciphers 0 to 1");
			assert.equal(rotor.decipher(1), 0, "Rotor model I with deflection 5 deciphers 1 to 0");
			assert.equal(rotor.encipher(25), 6, "Rotor model I with deflection 5 enciphers 25 to 6");			
			assert.equal(rotor.decipher(6), 25, "Rotor model I with deflection 5 deciphers 6 to 25");			
		});
		QUnit.test("It may take a ring setting in the constructor", function(assert){
			var rotor = new Rotor('I');
			assert.equal(rotor.ring_setting, 0, "Ring setting is 1 if not specified in the constructor");
			rotor = new Rotor('I', 0, 12);
			assert.equal(rotor.ring_setting, 12, "Ring setting set to 12 in constructor");
		});
		QUnit.test("The ring setting moves the cipher map", function(assert){
			var rotor = new Rotor('I', 0, 1);
			assert.equal(rotor.encipher(0), 10, "Rotor model I with ring setting 1 enciphers 0 to 10");
			assert.equal(rotor.decipher(10), 0, "Rotor model I with ring setting 1 deciphers 10 to 0");
			rotor = new Rotor('I', 0, 25);
			assert.equal(rotor.encipher(0), 9, "Rotor model I with ring setting 25 enciphers 0 to 9");
			assert.equal(rotor.decipher(9), 0, "Rotor model I with ring setting 25 deciphers 9 to 0");
		});
		QUnit.test("Both ground and ring settings work together to adjust the cipher map", function(assert){
			var rotor = new Rotor('I', 24, 5);
			assert.equal(rotor.encipher(0), 22, "Rotor model I with ring setting 5 and deflection 24 enciphers 0 to 22");
			assert.equal(rotor.decipher(22), 0, "Rotor model I with ring setting 5 and deflection 24 deciphers 22 to 0");
		});
		QUnit.test("It steps to increase deflection", function(assert){
			var rotor = new Rotor('I');
			assert.equal(rotor.deflection, 0, "Rotor has default deflection 0");
			rotor.step();
			assert.equal(rotor.deflection, 1, "Rotor has deflection 1 after 1 step");
			for(var idx = 0; idx < 10; idx++){
				rotor.step();
			}
			assert.equal(rotor.deflection, 11, "Rotor has deflection 11 after 11 steps");
			for(var idx = 0; idx < 15; idx++){
				rotor.step();
			}
			assert.equal(rotor.deflection, 0, "Rotor has deflection 0 after 26 steps");
		});
		QUnit.test("It has a turnover position to indicate the next-to-left rotor should also step", function(assert){
			var rotor = new Rotor('I');
			assert.equal(rotor.isInTurnoverPosition(), false, "Rotor I with deflection 0 and ring setting 0 should not step the next-to-left rotor on stepping");
			rotor = new Rotor('I', 16)
			assert.equal(rotor.isInTurnoverPosition(), true, "Rotor I with deflection 16 and ring setting 0 should step the next-to-left rotor on stepping");
		});	
		
		QUnit.module("Reflector Wheel");
		QUnit.test("Wiring model is specified in the constructor", function(assert){
			var reflector = new ReflectorWheel('B');
			assert.deepEqual(reflector.cipher_map, 'YRUHQSLDPXNGOKMIEBFZCWVJAT'.split(''), "Reflector Wheel B has translation model YRUHQSLDPXNGOKMIEBFZCWVJAT");
			reflector = new ReflectorWheel('C');
			assert.deepEqual(reflector.cipher_map, 'FVPJIAOYEDRZXWGCTKUQSBNMHL'.split(''), "Reflector Wheel C has translation model FVPJIAOYEDRZXWGCTKUQSBNMHL");
			reflector = new ReflectorWheel('B Thin');
			assert.deepEqual(reflector.cipher_map, 'ENKQAUYWJICOPBLMDXZVFTHRGS'.split(''), "Reflector Wheel B  Thin has translation model ENKQAUYWJICOPBLMDXZVFTHRGS");
			reflector = new ReflectorWheel('C Thin');
			assert.deepEqual(reflector.cipher_map, 'RDOBJNTKVEHMLFCWZAXGYIPSUQ'.split(''), "Reflector Wheel C Thin has translation model RDOBJNTKVEHMLFCWZAXGYIPSUQ");		
		});
		QUnit.test("It ciphers wire positions", function(assert){	
			var reflector = new ReflectorWheel('B');
			assert.equal(reflector.cipher(0), 24, "Reflector Wheel B ciphers 0 to 24");
			assert.equal(reflector.cipher(24), 0, "Reflector Wheel B ciphers 24 to 0");
			assert.equal(reflector.cipher(25), 19, "Reflector Wheel B ciphers 25 to 19");
			assert.equal(reflector.cipher(19), 25, "Reflector Wheel B ciphers 19 to 25");
		});		
		
		QUnit.module("Enigma Machine");
		QUnit.test("It accepts rotors, reflector wheel and plugboard settings in the constructor", function(assert){
			var enigma = new EnigmaMachine();
			assert.deepEqual(enigma.rotors, [], "Enigma with empty constructor has no rotors");
			assert.deepEqual(enigma.reflector_wheel.cipher_map, "", "Enigma with empty constructor has no reflector wheel");
			assert.deepEqual(enigma.plugboard.pairs, {}, "Enigma with empty constructor has an empty plugboard");
		});
		QUnit.test("It allows rotors set in the constructor to include ground and ring settings", function(assert){
			var enigma = new EnigmaMachine([['I', 5]]);
			assert.equal(enigma.rotors[0].deflection, 5, "Ground setting is 5");
			assert.equal(enigma.rotors[0].ring_setting, 0, "Ring Setting is 0");
			enigma = new EnigmaMachine([['I', 4, 12]]);
			assert.equal(enigma.rotors[0].deflection, 4, "Ground setting is 4");
			assert.equal(enigma.rotors[0].ring_setting, 12, "Ring Setting is 12");
		});
		QUnit.test("It connects the rotors so that they step together in turnover positions", function(assert){
			var enigma = new EnigmaMachine(['III', ['II', 3], ['I', 15]], 'B');
			enigma.cipher('A');
			assert.deepEqual([enigma.rotors[0].deflection, enigma.rotors[1].deflection, enigma.rotors[2].deflection], [0, 3, 16], "Rotor set III, II ground 3, I ground 15 advances only the fast rotor on stepping");
			enigma.cipher('A');
			assert.deepEqual([enigma.rotors[0].deflection, enigma.rotors[1].deflection, enigma.rotors[2].deflection], [0, 4, 17], "Rotor set III, II ground 3, I ground 16 advances the middle and fast rotors on stepping");
			enigma.cipher('A');
			assert.deepEqual([enigma.rotors[0].deflection, enigma.rotors[1].deflection, enigma.rotors[2].deflection], [1, 5, 18], "Rotor set III, II ground 4, I ground 17 advances the three rotors on stepping");
			enigma.cipher('A');
			assert.deepEqual([enigma.rotors[0].deflection, enigma.rotors[1].deflection, enigma.rotors[2].deflection], [1, 5, 19], "Rotor set III, II ground 5, I ground 18 advances only the fast rotor on stepping");
		});
		QUnit.test("It passes simple encoding tests", function(assert){
			var enigma = new EnigmaMachine(['I', 'II', 'III'], 'B');
			assert.equal(enigma.cipher('A'), 'B', "Enigma with rotor set I, II, III and reflector B encodes A to B");
			enigma = new EnigmaMachine(['I', 'II', 'III'], 'B');
			assert.equal(enigma.cipher('T'), 'O', "Enigma with rotor set I, II, III and reflector B encodes T to O");
			enigma = new EnigmaMachine(['I', 'II', 'III'], 'B');
			assert.equal(enigma.cipher('Z'), 'U', "Enigma with rotor set I, II, III and reflector B encodes Z to U");			
			enigma = new EnigmaMachine(['I', 'II', 'III'], 'B');
			assert.equal(enigma.cipher('AAA'), 'BDZ', "Enigma with rotor set I, II, III and reflector B encodes AAA to BDZ");
			enigma = new EnigmaMachine(['I', 'II', 'III'], 'B');
			assert.equal(enigma.cipher('BDZ'), 'AAA', "Enigma with rotor set I, II, III and reflector B encodes BDZ to AAA");
			enigma = new EnigmaMachine(['I', 'II', 'III'], 'B');
			assert.equal(enigma.cipher('BBB'), 'AJL', "Enigma with rotor set I, II, III and reflector B encodes BBB to AJL");
			enigma = new EnigmaMachine(['I', 'II', 'III'], 'B');
			assert.equal(enigma.cipher('AJL'), 'BBB', "Enigma with rotor set I, II, III and reflector B encodes AJL to BBB");
			enigma = new EnigmaMachine(['I', 'II', 'III'], 'B');
			assert.equal(enigma.cipher('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'BJELRQZVJWARXSNBXORSTNCFME', "Enigma with rotor set I, II, III and reflector B encodes ABCDEFGHIJKLMNOPQRSTUVWXYZ to BJELRQZVJWARXSNBXORSTNCFME");			
			enigma = new EnigmaMachine(['I', 'II', 'III'], 'B');
			assert.equal(enigma.cipher('BJELRQZVJWARXSNBXORSTNCFME'), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', "Enigma with rotor set I, II, III and reflector B encodes BJELRQZVJWARXSNBXORSTNCFME to ABCDEFGHIJKLMNOPQRSTUVWXYZ");			
			enigma = new EnigmaMachine(['VI', 'III', 'VII'], 'C');
			assert.equal(enigma.cipher('AAA'), 'NUC', "Enigma with rotor set VI, III, VII and reflector C encodes AAA to NUC");
			enigma = new EnigmaMachine(['VI', 'III', 'VII'], 'C');
			assert.equal(enigma.cipher('NUC'), 'AAA', "Enigma with rotor set VI, III, VII and reflector C encodes NUC to AAA");
			enigma = new EnigmaMachine(['I', 'II', 'III'], 'B', ['BT']);
			assert.equal(enigma.cipher('AAA'), 'TDZ', "Enigma with rotor set I, II, III, reflector B and plugboard B<->T encodes AAA to TDZ");
			enigma = new EnigmaMachine(['I', 'II', 'III'], 'B', ['BT']);
			assert.equal(enigma.cipher('TDZ'), 'AAA', "Enigma with rotor set I, II, III, reflector B and plugboard B<->T encodes TDZ to AAA");
			enigma = new EnigmaMachine(['Beta', 'I', 'II', 'III'], 'B Thin');
			assert.equal(enigma.cipher('A'), 'B', "Enigma with rotor set Beta, I, II, III and reflector B Thin encodes A to B");			
		});		
		QUnit.test("It passes complex encoding tests", function(assert){
			var enigma = new EnigmaMachine(['Beta', 'IV', 'VIII', 'II'], 'C Thin');
			assert.equal(enigma.cipher('A'), 'S', "Enigma with rotor set Beta, IV, VIII, II and reflector C Thin encodes A to S");	
			enigma = new EnigmaMachine([['Beta', 4], ['IV', 6], ['VIII', 16], ['II', 13]], 'C Thin');
			assert.equal(enigma.cipher('A'), 'K', "Enigma with rotor set Beta ground 4, IV ground 6, VIII ground 16, II ground 13 and reflector C Thin encodes A to K");
			enigma = new EnigmaMachine([['Beta', 0, 19], ['IV', 0, 23], ['VIII', 0, 2], ['II', 0, 11]], 'C Thin');
			assert.equal(enigma.cipher('A'), 'W', "Enigma with rotor set Beta ring 19, IV ring 23, VIII ring 2, II ring 11 and reflector C Thin encodes A to W");
			enigma = new EnigmaMachine([['Beta', 1, 19], ['IV', 1, 23], ['VIII', 1, 2], ['II', 1, 11]], 'C Thin');
			assert.equal(enigma.cipher('A'), 'Q', "Enigma with rotor set Beta ground 1 ring 19, IV ground 1 ring 23, VIII ground 1 ring 2, II ground 1 ring 11 and reflector C Thin encodes A to Q");
			enigma = new EnigmaMachine([['Beta', 25, 19], ['IV', 25, 23], ['VIII', 25, 2], ['II', 25, 11]], 'C Thin');
			assert.equal(enigma.cipher('A'), 'I', "Enigma with rotor set Beta ground 25 ring 19, IV ground 25 ring 23, VIII ground 25 ring 2, II ground 25 ring 11 and reflector C Thin encodes A to I");
			enigma = new EnigmaMachine([['Beta', 4, 19], ['IV', 6, 23], ['VIII', 16, 2], ['II', 13, 11]], 'C Thin');
			assert.equal(enigma.cipher('A'), 'P', "Enigma with rotor set Beta ground 4 ring 19, IV ground 6 ring 23, VIII ground 16 ring 2, II ground 13 ring 11 and reflector C Thin encodes A to P");			
			enigma = new EnigmaMachine([['Beta', 4, 19], ['IV', 6, 23], ['VIII', 16, 2], ['II', 13, 11]], 'C Thin', ['AT', 'BP', 'CY', 'EO', 'FX', 'HI', 'JS', 'KL', 'MZ', 'UV']);
			assert.equal(enigma.cipher('A'), 'C', "Enigma with rotor set Beta ground 4 ring 19, IV ground 6 ring 23, VIII ground 16 ring 2, II ground 13 ring 11, reflector C Thin and plugboard A<>T, B<>P, C<>Y, E<>O, F<>X, H<>I, J<>S, K<>L, M<>Z, U<>Z encodes A to C");			
			enigma = new EnigmaMachine([['Beta', 4, 19], ['IV', 6, 23], ['VIII', 16, 2], ['II', 13, 11]], 'C Thin', ['AT', 'BP', 'CY', 'EO', 'FX', 'HI', 'JS', 'KL', 'MZ', 'UV']);
			assert.equal(enigma.cipher('THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG'), 'BPVJRKDUZEZVOTYZNYCEFVFFDSLZGYQWJPF', "Enigma with rotor set Beta ground 4 ring 19, IV ground 6 ring 23, VIII ground 16 ring 2, II ground 13 ring 11, reflector C Thin and plugboard A<>T, B<>P, C<>Y, E<>O, F<>X, H<>I, J<>S, K<>L, M<>Z, U<>Z encodes THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG to BPVJRKDUZEZVOTYZNYCEFVFFDSLZGYQWJPF");
			enigma = new EnigmaMachine([['Beta', 4, 19], ['IV', 6, 23], ['VIII', 16, 2], ['II', 13, 11]], 'C Thin', ['AT', 'BP', 'CY', 'EO', 'FX', 'HI', 'JS', 'KL', 'MZ', 'UV']);
			assert.equal(enigma.cipher('BPVJRKDUZEZVOTYZNYCEFVFFDSLZGYQWJPF'), 'THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG', "Enigma with rotor set Beta ground 4 ring 19, IV ground 6 ring 23, VIII ground 16 ring 2, II ground 13 ring 11, reflector C Thin and plugboard A<>T, B<>P, C<>Y, E<>O, F<>X, H<>I, J<>S, K<>L, M<>Z, U<>Z encodes BPVJRKDUZEZVOTYZNYCEFVFFDSLZGYQWJPF to THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG");
		});	
		QUnit.test("It can accurately cipher real, historical enigma messages", function(assert){
			// http://wiki.franklinheath.co.uk/index.php/Enigma/Sample_Messages
			var enigma = new EnigmaMachine([['II', 1, 1], ['IV', 11, 20], ['V', 0, 11]], 'B', ['AV', 'BS', 'CG', 'DL', 'FU', 'HZ', 'IN', 'KM', 'OW', 'RX']);
			assert.equal(enigma.cipher('EDPUDNRGYSZRCXNUYTPOMRMBOFKTBZREZKMLXLVEFGUEYSIOZVEQMIKUBPMMYLKLTTDEISMDICAGYKUACTCDOMOHWXMUUIAUBSTSLRNBZSZWNRFXWFYSSXJZVIJHIDISHPRKLKAYUPADTXQSPINQMATLPIFSVKDASCTACDPBOPVHJK'), 'AUFKLXABTEILUNGXVONXKURTINOWAXKURTINOWAXNORDWESTLXSEBEZXSEBEZXUAFFLIEGERSTRASZERIQTUNGXDUBROWKIXDUBROWKIXOPOTSCHKAXOPOTSCHKAXUMXEINSAQTDREINULLXUHRANGETRETENXANGRIFFXINFXRGTX', "Operation Barbarossa. Sent from the Russian front on 7th July 1941. Part 1.");
			enigma = new EnigmaMachine([['II', 11, 1], ['IV', 18, 20], ['V', 3, 11]], 'B', ['AV', 'BS', 'CG', 'DL', 'FU', 'HZ', 'IN', 'KM', 'OW', 'RX']);
			assert.equal(enigma.cipher('SFBWDNJUSEGQOBHKRTAREEZMWKPPRBXOHDROEQGBBGTQVPGVKBVVGBIMHUSZYDAJQIROAXSSSNREHYGGRPISEZBOVMQIEMMZCYSGQDGRERVBILEKXYQIRGIRQNRDNVRXCYYTNJR'), 'DREIGEHTLANGSAMABERSIQERVORWAERTSXEINSSIEBENNULLSEQSXUHRXROEMXEINSXINFRGTXDREIXAUFFLIEGERSTRASZEMITANFANGXEINSSEQSXKMXKMXOSTWXKAMENECXK', "Operation Barbarossa. Sent from the Russian front on 7th July 1941. Part 2.");
			enigma = new EnigmaMachine([['Beta', 21, 0], ['II', 9, 0], ['IV', 13, 0], ['I', 0, 21]], 'B Thin', ['AT', 'BL', 'DF', 'GJ', 'HM', 'NW', 'OP', 'QY', 'RZ', 'VX']);
			assert.equal(enigma.cipher('NCZWVUSXPNYMINHZXMQXSFWXWLKJAHSHNMCOCCAKUQPMKCSMHKSEINJUSBLKIOSXCKUBHMLLXCSJUSRRDVKOHULXWCCBGVLIYXEOAHXRHKKFVDREWEZLXOBAFGYUJQUKGRTVUKAMEURBVEKSUHHVOYHABCJWMAKLFKLMYFVNRIZRVVRTKOFDANJMOLBGFFLEOPRGTFLVRHOWOPBEKVWMUQFMPWPARMFHAGKXIIBG'), 'VONVONJLOOKSJHFFTTTEINSEINSDREIZWOYYQNNSNEUNINHALTXXBEIANGRIFFUNTERWASSERGEDRUECKTYWABOSXLETZTERGEGNERSTANDNULACHTDREINULUHRMARQUANTONJOTANEUNACHTSEYHSDREIYZWOZWONULGRADYACHTSMYSTOSSENACHXEKNSVIERMBFAELLTYNNNNNNOOOVIERYSICHTEINSNULL', 'U-264 (Kapitänleutnant Hartwig Looks) - Sent from a U-boat on 25th November 1942, this message was enciphered using their standard-equipment Enigma M4 machine.');
			enigma = new EnigmaMachine([['III', 20, 0], ['VI', 25, 7], ['VIII', 21, 12]], 'B', ['AN', 'EZ', 'HK', 'IJ', 'LR', 'MQ', 'OT', 'PV', 'SW', 'UX']);
			assert.equal(enigma.cipher('YKAENZAPMSCHZBFOCUVMRMDPYCOFHADZIZMEFXTHFLOLPZLFGGBOTGOXGRETDWTJIQHLMXVJWKZUASTR'), 'STEUEREJTANAFJORDJANSTANDORTQUAAACCCVIERNEUNNEUNZWOFAHRTZWONULSMXXSCHARNHORSTHCO', 'Scharnhorst (Konteradmiral Erich Bey) - This message was sent from the battleship Scharnhorst on 26th December 1943, the day on which it was sunk by torpedoes from British destroyers.');
		});
	});
})(jQuery);
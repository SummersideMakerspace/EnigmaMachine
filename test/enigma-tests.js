/*

Copyright 2016 Summerside Makerspace Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

(function($){
	$(document).ready(function(){
		
		QUnit.config.reorder = false;
		QUnit.module("Enigma Core", function(){
			QUnit.module("Basics");
			QUnit.test("Plugboard is available", function(assert){
				assert.ok(Plugboard, "Plugboard exists");
				var plugboard = new Plugboard();
				assert.ok(Plugboard.prototype.isPrototypeOf(plugboard), "Instantiated Plugboard");
			});
			QUnit.test("Uhr is available", function(assert){
				assert.ok(Uhr, "Uhr exists");
				var uhr = new Uhr();
				assert.ok(Uhr.prototype.isPrototypeOf(uhr), "Instantiated Uhr");
				assert.ok(Plugboard.prototype.isPrototypeOf(uhr), "Uhr extends Plugboard");
			});			
			QUnit.test("Entry Wheel is available", function(assert){
				assert.ok(EntryWheel, "Entry Wheel exists");
				var entry_wheel = new EntryWheel();
				assert.ok(EntryWheel.prototype.isPrototypeOf(entry_wheel), "Instantiated EntryWheel");
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
			QUnit.test("Pairs can be specified in the constructor", function(assert){	
				var plugboard = new Plugboard(['AZ']);
				assert.deepEqual(plugboard.pairs, {'A': 'Z', 'Z': 'A'}, "Single Pair");
				plugboard = new Plugboard(['AZ', 'BC']);
				assert.deepEqual(plugboard.pairs, {'A': 'Z', 'Z': 'A', 'B': 'C', 'C': 'B'}, "Two Pairs");
			});	
			QUnit.test("It translates letters based on pair settings", function(assert){	
				var plugboard = new Plugboard();
				assert.equal(plugboard.translate('A'), 'A', "Plugboard with no pairs translates a letter to itself");
				plugboard = new Plugboard(['AZ']);
				assert.equal(plugboard.translate('A'), 'Z', "Plugboard with pair [AZ] translates letter A to letter Z");
				assert.equal(plugboard.translate('Z'), 'A', "Plugboard with pair [AZ] translates letter Z to letter A");
			});				
			
			QUnit.module("Uhr");
			QUnit.test("Pairs can be specified in the constructor", function(assert){	
				var uhr = new Uhr(['AZ']);
				assert.deepEqual(uhr.pairs, {'A': 'Z', 'Z': 'A'}, "Single Pair");
				uhr = new Uhr(['AZ', 'BC']);
				assert.deepEqual(uhr.pairs, {'A': 'Z', 'Z': 'A', 'B': 'C', 'C': 'B'}, "Two Pairs");
			});	
			QUnit.test("Setting can be specified in the constructor", function(assert){	
				var uhr = new Uhr([], 0);
				assert.equal(uhr.setting, 0, "Setting 0");
				uhr = new Uhr([], 39);
				assert.equal(uhr.setting, 39, "Setting 39");
			});	
			QUnit.test("Setting is in range of 0 to 39, invalid settings result in setting to 0", function(assert){	
				var uhr = new Uhr([], 49);
				assert.equal(uhr.setting, 0, "Setting 0");
				var uhr = new Uhr([], 'aaa');
				assert.equal(uhr.setting, 0, "Setting 0");
			});				
			QUnit.test("It translates letters based on uhr setting and pair settings", function(assert){	
				var uhr = new Uhr();
				assert.equal(uhr.translate('A'), 'A', "Uhr with empty constructor translates a letter to itself");
				uhr = new Uhr(['AZ']);
				assert.equal(uhr.translate('A'), 'Z', "Uhr with pair [AZ], empty setting translates letter A to letter Z");
				assert.equal(uhr.translate('Z'), 'A', "Uhr with pair [AZ], empty setting translates letter Z to letter A");
				uhr = new Uhr([], 3);
				assert.equal(uhr.translate('A'), 'A', "Uhr with no pairs, setting 3 translates letter A to itself");
				uhr = new Uhr(['AZ'], 3);
				assert.equal(uhr.translate('A'), '', "Uhr with pair [AZ], setting 3 translates letter A to nothing");
				assert.equal(uhr.translate('Z'), '', "Uhr with pair [AZ], setting 3 translates letter Z to nothing");
				uhr = new Uhr(['AZ', 'BY', 'CX', 'DW', 'EV', 'FU', 'GT', 'HS', 'IR', 'JQ'], 3);
				assert.equal(uhr.translate('A'), 'V', "Uhr with pairs [AZ, BY, CX, DW, EV, FU, GT, HS, IR, JQ], setting 3 translates letter A to letter V");
				assert.equal(uhr.translate('Z'), 'F', "Uhr with pairs [AZ, BY, CX, DW, EV, FU, GT, HS, IR, JQ], setting 3 translates letter Z to letter F");				
			});	
			QUnit.test("The order that pairs and plugs are given in does not matter when the setting is 0", function(assert){	
				uhr = new Uhr(['AZ', 'BY', 'CX', 'DW', 'EV', 'FU', 'GT', 'HS', 'IR', 'JQ']);
				assert.equal(uhr.translate('A'), 'Z', "Uhr with pairs [AZ, BY, CX, DW, EV, FU, GT, HS, IR, JQ], setting 0 translates letter A to letter Z");
				assert.equal(uhr.translate('Z'), 'A', "Uhr with pairs [AZ, BY, CX, DW, EV, FU, GT, HS, IR, JQ], setting 0 translates letter Z to letter A");
				uhr = new Uhr(['BY', 'AZ', 'CX', 'DW', 'EV', 'FU', 'GT', 'HS', 'IR', 'JQ']);
				assert.equal(uhr.translate('A'), 'Z', "Uhr with pair [BY, AZ, CX, DW, EV, FU, GT, HS, IR, JQ], setting 0 translates letter A to letter Z");
				assert.equal(uhr.translate('Z'), 'A', "Uhr with pair [BY, AZ, CX, DW, EV, FU, GT, HS, IR, JQ], setting 0 translates letter Z to letter A");
				uhr = new Uhr(['ZA', 'BY', 'CX', 'DW', 'EV', 'FU', 'GT', 'HS', 'IR', 'JQ']);
				assert.equal(uhr.translate('A'), 'Z', "Uhr with pair [ZA, BY, CX, DW, EV, FU, GT, HS, IR, JQ], setting 0 translates letter A to letter Z");
				assert.equal(uhr.translate('Z'), 'A', "Uhr with pair [ZA, BY, CX, DW, EV, FU, GT, HS, IR, JQ], setting 0 translates letter Z to letter A");				
			});	
			QUnit.test("The order that pairs and plugs are given in does matter when the setting is not 0", function(assert){	
				uhr = new Uhr(['AZ', 'BY', 'CX', 'DW', 'EV', 'FU', 'GT', 'HS', 'IR', 'JQ'], 3);
				assert.equal(uhr.translate('A'), 'V', "Uhr with pairs [AZ, BY, CX, DW, EV, FU, GT, HS, IR, JQ], setting 3 translates letter A to letter V");
				assert.equal(uhr.translate('Z'), 'F', "Uhr with pairs [AZ, BY, CX, DW, EV, FU, GT, HS, IR, JQ], setting 3 translates letter Z to letter F");
				uhr = new Uhr(['BY', 'AZ', 'CX', 'DW', 'EV', 'FU', 'GT', 'HS', 'IR', 'JQ'], 3);
				assert.equal(uhr.translate('A'), 'R', "Uhr with pair [BY, AZ, CX, DW, EV, FU, GT, HS, IR, JQ], setting 3 translates letter A to letter R");
				assert.equal(uhr.translate('Z'), 'H', "Uhr with pair [BY, AZ, CX, DW, EV, FU, GT, HS, IR, JQ], setting 3 translates letter Z to letter H");
				uhr = new Uhr(['ZA', 'BY', 'CX', 'DW', 'EV', 'FU', 'GT', 'HS', 'IR', 'JQ'], 3);
				assert.equal(uhr.translate('A'), 'F', "Uhr with pair [ZA, BY, CX, DW, EV, FU, GT, HS, IR, JQ], setting 3 translates letter A to letter F");
				assert.equal(uhr.translate('Z'), 'V', "Uhr with pair [ZA, BY, CX, DW, EV, FU, GT, HS, IR, JQ], setting 3 translates letter Z to letter V");				
			});				
			
			QUnit.module("Entry Wheel");
			QUnit.test("It converts letters to wire positions", function(assert){
				var entry_wheel = new EntryWheel();
				assert.equal(entry_wheel.letterToWire('A'), 0, "It converts letter A to wire position 0");
				assert.equal(entry_wheel.letterToWire('F'), 5, "It converts letter F to wire position 5");
				assert.equal(entry_wheel.letterToWire('T'), 19, "It converts letter T to wire position 19");
				assert.equal(entry_wheel.letterToWire('Y'), 24, "It converts letter Y to wire position 24");
			});
			QUnit.test("It converts wire positions to letters", function(assert){
				var entry_wheel = new EntryWheel();
				assert.equal(entry_wheel.wireToLetter(0), 'A', "It converts wire position 0 to letter A");
				assert.equal(entry_wheel.wireToLetter(5), 'F', "It converts wire position 5 to letter F");
				assert.equal(entry_wheel.wireToLetter(19), 'T', "It converts wire position 19 to letter T");
				assert.equal(entry_wheel.wireToLetter(24), 'Y', "It converts wire position 24 to letter Y");
			});		
			
			QUnit.module("Rotor");
			QUnit.test("Translation model is specified in the constructor", function(assert){
				var rotor = new Rotor({cipher_map: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', turnover_positions: 'Q'});
				assert.deepEqual(rotor.encipher_map, 'EKMFLGDQVZNTOWYHXUSPAIBRCJ'.split(''), "Rotor has translation model EKMFLGDQVZNTOWYHXUSPAIBRCJ");
			});		
			QUnit.test("It enciphers from right to left", function(assert){	
				var rotor = new Rotor({cipher_map: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', turnover_positions: 'Q'});
				assert.equal(rotor.encipher(0), 4, "Rotor model I enciphers 0 to 4");
				assert.equal(rotor.encipher(4), 11, "Rotor model I enciphers 4 to 11");
				assert.equal(rotor.encipher(1), 10, "Rotor model I enciphers 1 to 10");
				assert.equal(rotor.encipher(25), 9, "Rotor model I enciphers 25 to 9");
				assert.equal(rotor.encipher(9), 25, "Rotor model I enciphers 9 to 25");
			});
			QUnit.test("The contact positions used during enciphering are available", function(assert){
				var rotor = new Rotor({cipher_map: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', turnover_positions: 'Q'});
				rotor.encipher(0);
				assert.equal(rotor.encipher_contact_position_right, 0, "Rotor model I enciphers 0 to 4 with contact position right at 0");
				assert.equal(rotor.encipher_contact_position_left, 4, "Rotor model I enciphers 0 to 4 with contact position left at 4");
			});
			QUnit.test("It deciphers from left to right", function(assert){	
				var rotor = new Rotor({cipher_map: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', turnover_positions: 'Q'});
				assert.equal(rotor.decipher(4), 0, "Rotor model I deciphers 4 to 0");
				assert.equal(rotor.decipher(11), 4, "Rotor model I deciphers 11 to 4");
				assert.equal(rotor.decipher(10), 1, "Rotor model I deciphers 10 to 1");
				assert.equal(rotor.decipher(9), 25, "Rotor model I deciphers 9 to 25");
				assert.equal(rotor.decipher(25), 9, "Rotor model I deciphers 25 to 9");
			});
			QUnit.test("The contact positions used during deciphering are available", function(assert){
				var rotor = new Rotor({cipher_map: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', turnover_positions: 'Q'});
				rotor.decipher(4);
				assert.equal(rotor.decipher_contact_position_left, 4, "Rotor model I deciphers 4 to 0 with contact position left at 4");
				assert.equal(rotor.decipher_contact_position_right, 0, "Rotor model I deciphers 4 to 0 with contact position right at 0");
			});			
			QUnit.test("It may take a ground setting (initial deflection) in the constructor", function(assert){
				var rotor = new Rotor({cipher_map: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', turnover_positions: 'Q'});
				assert.equal(rotor.deflection, 0, "Deflection is 0 if not specified in the constructor");
				rotor = new Rotor({cipher_map: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', turnover_positions: 'Q'}, 20);
				assert.equal(rotor.deflection, 20, "Deflection is set to 20 in constructor");
			});		
			QUnit.test("It can be deflected through rotations", function(assert){	
				var rotor = new Rotor({cipher_map: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', turnover_positions: 'Q'}, 1);
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
				var rotor = new Rotor({cipher_map: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', turnover_positions: 'Q'});
				assert.equal(rotor.ring_setting, 0, "Ring setting is 1 if not specified in the constructor");
				rotor = new Rotor({cipher_map: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', turnover_positions: 'Q'}, 0, 12);
				assert.equal(rotor.ring_setting, 12, "Ring setting set to 12 in constructor");
			});
			QUnit.test("The ring setting moves the cipher map", function(assert){
				var rotor = new Rotor({cipher_map: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', turnover_positions: 'Q'}, 0, 1);
				assert.equal(rotor.encipher(0), 10, "Rotor model I with ring setting 1 enciphers 0 to 10");
				assert.equal(rotor.decipher(10), 0, "Rotor model I with ring setting 1 deciphers 10 to 0");
				rotor = new Rotor({cipher_map: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', turnover_positions: 'Q'}, 0, 25);
				assert.equal(rotor.encipher(0), 9, "Rotor model I with ring setting 25 enciphers 0 to 9");
				assert.equal(rotor.decipher(9), 0, "Rotor model I with ring setting 25 deciphers 9 to 0");
			});
			QUnit.test("Both ground and ring settings work together to adjust the cipher map", function(assert){
				var rotor = new Rotor({cipher_map: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', turnover_positions: 'Q'}, 24, 5);
				assert.equal(rotor.encipher(0), 22, "Rotor model I with ring setting 5 and deflection 24 enciphers 0 to 22");
				assert.equal(rotor.decipher(22), 0, "Rotor model I with ring setting 5 and deflection 24 deciphers 22 to 0");
			});
			QUnit.test("It steps to increase deflection", function(assert){
				var rotor = new Rotor({cipher_map: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', turnover_positions: 'Q'});
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
				var rotor = new Rotor({cipher_map: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', turnover_positions: 'Q'});
				assert.equal(rotor.isInTurnoverPosition(), false, "Rotor I with deflection 0 and ring setting 0 should not step the next-to-left rotor on stepping");
				rotor = new Rotor({cipher_map: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', turnover_positions: 'Q'}, 16)
				assert.equal(rotor.isInTurnoverPosition(), true, "Rotor I with deflection 16 and ring setting 0 should step the next-to-left rotor on stepping");
			});	
			
			QUnit.module("Reflector Wheel");
			QUnit.test("Wiring model is specified in the constructor", function(assert){
				var reflector = new ReflectorWheel('YRUHQSLDPXNGOKMIEBFZCWVJAT');
				assert.deepEqual(reflector.cipher_map, 'YRUHQSLDPXNGOKMIEBFZCWVJAT'.split(''), "Reflector Wheel B has translation model YRUHQSLDPXNGOKMIEBFZCWVJAT");
			});
			QUnit.test("It ciphers wire positions", function(assert){	
				var reflector = new ReflectorWheel('YRUHQSLDPXNGOKMIEBFZCWVJAT');
				assert.equal(reflector.cipher(0), 24, "Reflector Wheel B ciphers 0 to 24");
				assert.equal(reflector.cipher(24), 0, "Reflector Wheel B ciphers 24 to 0");
				assert.equal(reflector.cipher(25), 19, "Reflector Wheel B ciphers 25 to 19");
				assert.equal(reflector.cipher(19), 25, "Reflector Wheel B ciphers 19 to 25");
			});		
			QUnit.test("It may take a ground setting (initial deflection) in the constructor", function(assert){
				var reflector = new ReflectorWheel('IMETCGFRAYSQBZXWLHKDVUPOJN');
				assert.equal(reflector.deflection, 0, "Deflection is 0 if not specified in the constructor");
				var reflector = new ReflectorWheel('IMETCGFRAYSQBZXWLHKDVUPOJN', 20);
				assert.equal(reflector.deflection, 20, "Deflection is set to 20 in constructor");
			});		
			QUnit.test("It can be deflected through rotations", function(assert){	
				var reflector = new ReflectorWheel('IMETCGFRAYSQBZXWLHKDVUPOJN', 0);
				assert.equal(reflector.cipher(0), 8, "Zählwerk reflector with deflection 0 enciphers 0 to 8");
				reflector.deflection = 1;
				assert.equal(reflector.cipher(0), 11, "Zählwerk reflector with deflection 1 enciphers 0 to 11");
				assert.equal(reflector.cipher(11), 0, "Zählwerk reflector with deflection 1 deciphers 11 to 0");
				assert.equal(reflector.cipher(25), 7, "Zählwerk reflector with deflection 1 enciphers 25 to 7");
				assert.equal(reflector.cipher(7), 25, "Zählwerk reflector with deflection 1 deciphers 7 to 25");
				reflector.deflection = 25;
				assert.equal(reflector.cipher(0), 14, "Zählwerk reflector with deflection 25 enciphers 0 to 14");
				assert.equal(reflector.cipher(14), 0, "Zählwerk reflector with deflection 25 deciphers 14 to 0");
				assert.equal(reflector.cipher(25), 10, "Zählwerk reflector with deflection 25 enciphers 25 to 10");
				assert.equal(reflector.cipher(10), 25, "Zählwerk reflector with deflection 25 deciphers 10 to 25");
				reflector.deflection = 5;
				assert.equal(reflector.cipher(0), 1, "Zählwerk reflector with deflection 5 enciphers 0 to 1");
				assert.equal(reflector.cipher(1), 0, "Zählwerk reflector with deflection 5 deciphers 1 to 0");
				assert.equal(reflector.cipher(25), 23, "Zählwerk reflector with deflection 5 enciphers 25 to 23");			
				assert.equal(reflector.cipher(23), 25, "Zählwerk reflector with deflection 5 deciphers 23 to 25");			
			});
			QUnit.test("It steps to increase deflection", function(assert){
				var reflector = new ReflectorWheel('IMETCGFRAYSQBZXWLHKDVUPOJN', 0);
				assert.equal(reflector.deflection, 0, "Reflector wheel has default deflection 0");
				reflector.step();
				assert.equal(reflector.deflection, 1, "Reflector wheel has deflection 1 after 1 step");
				for(var idx = 0; idx < 10; idx++){
					reflector.step();
				}
				assert.equal(reflector.deflection, 11, "Reflector wheel has deflection 11 after 11 steps");
				for(var idx = 0; idx < 15; idx++){
					reflector.step();
				}
				assert.equal(reflector.deflection, 0, "Reflector wheel has deflection 0 after 26 steps");
			});			
			
			QUnit.module("Enigma Machine");
			QUnit.test("It accepts machine version in the constructor", function(assert){
				var enigma = new EnigmaMachine();
				assert.deepEqual(enigma.machine_version, 'M4', "Enigma with empty constructor has M4 version");
				var enigma = new EnigmaMachine('T');
				assert.deepEqual(enigma.machine_version, 'T', "Enigma T (Tirpitz)");
			});		
			QUnit.test("It accepts rotors, reflector wheel and plugboard settings in the constructor", function(assert){
				var enigma = new EnigmaMachine();
				assert.deepEqual(enigma.rotors, [], "Enigma with empty constructor has no rotors");
				assert.deepEqual(enigma.reflector_wheel.cipher_map, [], "Enigma with empty constructor has no reflector wheel");
				assert.deepEqual(enigma.plugboard.pairs, {}, "Enigma with empty constructor has an empty plugboard");
			});
			QUnit.test("It allows uhr to be enabled and set in the constructor", function(assert){
				var enigma = new EnigmaMachine('M4', [], '', [], false);
				assert.notOk(Uhr.prototype.isPrototypeOf(enigma.plugboard), "Enigma not using Uhr");
				var enigma = new EnigmaMachine('M4', [], '', [], 2);
				assert.equal(enigma.plugboard.setting, 2, "Enigma using Uhr with setting 2");
			});			
			QUnit.test("It allows rotors set in the constructor to include ground and ring settings", function(assert){
				var enigma = new EnigmaMachine('M3', [['I', 5]]);
				assert.equal(enigma.rotors[0].deflection, 5, "Ground setting is 5");
				assert.equal(enigma.rotors[0].ring_setting, 0, "Ring Setting is 0");
				enigma = new EnigmaMachine('M3', [['I', 4, 12]]);
				assert.equal(enigma.rotors[0].deflection, 4, "Ground setting is 4");
				assert.equal(enigma.rotors[0].ring_setting, 12, "Ring Setting is 12");
			});
			QUnit.test("It allows reflector set in the constructor to include ground setting", function(assert){
				var enigma = new EnigmaMachine('G', [], ['UKW', 5]);
				assert.equal(enigma.reflector_wheel.deflection, 5, "Ground setting is 5");
			});
			QUnit.test("It connects the rotors so that they step together in turnover positions", function(assert){
				var enigma = new EnigmaMachine('M3', ['III', ['II', 3], ['I', 15]], 'B');
				enigma.cipher('A');
				assert.deepEqual([enigma.rotors[0].deflection, enigma.rotors[1].deflection, enigma.rotors[2].deflection], [0, 3, 16], "Rotor set III, II ground 3, I ground 15 advances only the fast rotor on stepping");
				enigma.cipher('A');
				assert.deepEqual([enigma.rotors[0].deflection, enigma.rotors[1].deflection, enigma.rotors[2].deflection], [0, 4, 17], "Rotor set III, II ground 3, I ground 16 advances the middle and fast rotors on stepping");
				enigma.cipher('A');
				assert.deepEqual([enigma.rotors[0].deflection, enigma.rotors[1].deflection, enigma.rotors[2].deflection], [1, 5, 18], "Rotor set III, II ground 4, I ground 17 advances the three rotors on stepping");
				enigma.cipher('A');
				assert.deepEqual([enigma.rotors[0].deflection, enigma.rotors[1].deflection, enigma.rotors[2].deflection], [1, 5, 19], "Rotor set III, II ground 5, I ground 18 advances only the fast rotor on stepping");
			});	
			QUnit.test("In motorized operation, the UKW also steps with other rotors", function(assert){
				var enigma = new EnigmaMachine('Zählwerk', ['I', 'II', 'III'], 'UKW');
				enigma.cipher('A');
				assert.deepEqual([enigma.reflector_wheel.deflection, enigma.rotors[0].deflection, enigma.rotors[1].deflection, enigma.rotors[2].deflection], [1, 1, 1, 1], "Cog stepping with Rotor set I, II, III advances all rotors and the reflector on stepping");
				enigma.cipher('A');
				assert.deepEqual([enigma.reflector_wheel.deflection, enigma.rotors[0].deflection, enigma.rotors[1].deflection, enigma.rotors[2].deflection], [1, 1, 1, 2], "Cog stepping with Rotor set I ground 1, II ground 1, III ground 1 and reflector ground 1 advances the fast rotor only on stepping");
				enigma.cipher('A');
				enigma.cipher('A');
				enigma.cipher('A');
				assert.deepEqual([enigma.reflector_wheel.deflection, enigma.rotors[0].deflection, enigma.rotors[1].deflection, enigma.rotors[2].deflection], [1, 1, 2, 5], "Cog stepping with Rotor set I ground 1, II ground 1, III ground 4 and reflector ground 1 advances the middle and fast rotors on stepping");
				enigma.cipher('A');
				assert.deepEqual([enigma.reflector_wheel.deflection, enigma.rotors[0].deflection, enigma.rotors[1].deflection, enigma.rotors[2].deflection], [2, 2, 3, 6], "Cog stepping with Rotor set I ground 1, II ground 1, III ground 1 and reflector ground 1 advances all rotors and the reflector on stepping");
			});				
			QUnit.test("It returns a blank if the uhr has a disconnected wire", function(assert){
				var enigma = new EnigmaMachine('M3', ['I', 'II', 'III'], 'B', ['AZ'], 1);
				assert.equal(enigma.cipher('A'), '', "Enigma ciphers A to blank");
			});
			QUnit.test("It returns a blank if the reflector has a disconnected wire", function(assert){
				var enigma = new EnigmaMachine('M3', ['I', 'II', ['III', 18]], 'D', []);
				enigma.reflector_wheel.cipher_map[0] = '';
				assert.equal(enigma.cipher('A'), '', "Enigma ciphers A to blank");
			});			
			QUnit.test("It passes simple encoding tests", function(assert){
				var enigma = new EnigmaMachine('M3', ['I', 'II', 'III'], 'B');
				assert.equal(enigma.cipher('A'), 'B', "Enigma with rotor set I, II, III and reflector B encodes A to B");
				enigma = new EnigmaMachine('M3', ['I', 'II', 'III'], 'B');
				assert.equal(enigma.cipher('T'), 'O', "Enigma with rotor set I, II, III and reflector B encodes T to O");
				enigma = new EnigmaMachine('M3', ['I', 'II', 'III'], 'B');
				assert.equal(enigma.cipher('Z'), 'U', "Enigma with rotor set I, II, III and reflector B encodes Z to U");			
				enigma = new EnigmaMachine('M3', ['I', 'II', 'III'], 'B');
				assert.equal(enigma.cipher('AAA'), 'BDZ', "Enigma with rotor set I, II, III and reflector B encodes AAA to BDZ");
				enigma = new EnigmaMachine('M3', ['I', 'II', 'III'], 'B');
				assert.equal(enigma.cipher('BDZ'), 'AAA', "Enigma with rotor set I, II, III and reflector B encodes BDZ to AAA");
				enigma = new EnigmaMachine('M3', ['I', 'II', 'III'], 'B');
				assert.equal(enigma.cipher('BBB'), 'AJL', "Enigma with rotor set I, II, III and reflector B encodes BBB to AJL");
				enigma = new EnigmaMachine('M3', ['I', 'II', 'III'], 'B');
				assert.equal(enigma.cipher('AJL'), 'BBB', "Enigma with rotor set I, II, III and reflector B encodes AJL to BBB");
				enigma = new EnigmaMachine('M3', ['I', 'II', 'III'], 'B');
				assert.equal(enigma.cipher('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'BJELRQZVJWARXSNBXORSTNCFME', "Enigma with rotor set I, II, III and reflector B encodes ABCDEFGHIJKLMNOPQRSTUVWXYZ to BJELRQZVJWARXSNBXORSTNCFME");			
				enigma = new EnigmaMachine('M3', ['I', 'II', 'III'], 'B');
				assert.equal(enigma.cipher('BJELRQZVJWARXSNBXORSTNCFME'), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', "Enigma with rotor set I, II, III and reflector B encodes BJELRQZVJWARXSNBXORSTNCFME to ABCDEFGHIJKLMNOPQRSTUVWXYZ");			
				enigma = new EnigmaMachine('M3', ['VI', 'III', 'VII'], 'C');
				assert.equal(enigma.cipher('AAA'), 'NUC', "Enigma with rotor set VI, III, VII and reflector C encodes AAA to NUC");
				enigma = new EnigmaMachine('M3', ['VI', 'III', 'VII'], 'C');
				assert.equal(enigma.cipher('NUC'), 'AAA', "Enigma with rotor set VI, III, VII and reflector C encodes NUC to AAA");
				enigma = new EnigmaMachine('M3', ['I', 'II', 'III'], 'B', ['BT']);
				assert.equal(enigma.cipher('AAA'), 'TDZ', "Enigma with rotor set I, II, III, reflector B and plugboard B<->T encodes AAA to TDZ");
				enigma = new EnigmaMachine('M3', ['I', 'II', 'III'], 'B', ['BT']);
				assert.equal(enigma.cipher('TDZ'), 'AAA', "Enigma with rotor set I, II, III, reflector B and plugboard B<->T encodes TDZ to AAA");
				enigma = new EnigmaMachine('M4', ['β', 'I', 'II', 'III'], 'B Thin');
				assert.equal(enigma.cipher('A'), 'B', "Enigma with rotor set Beta, I, II, III and reflector B Thin encodes A to B");			
			});	
			QUnit.test("It allows spaces in the text and passes these through to the ciphertext", function(assert){
				var enigma = new EnigmaMachine('M3', ['I', 'II', 'III'], 'B');
				assert.equal(enigma.cipher('A A A'), 'B D Z', "Enigma with rotor set I, II, III and reflector B ciphers 'A A A' to 'B D Z'");
			});
			QUnit.test("It ignores and discards invalid characters", function(assert){
				var enigma = new EnigmaMachine('M3', ['I', 'II', 'III'], 'B');
				assert.equal(enigma.cipher('A9B'), 'BJ', "Enigma with rotor set I, II, III and reflector B ciphers 'A9B' to 'BJ'");
			});				
			QUnit.test("It passes complex encoding tests", function(assert){
				var enigma = new EnigmaMachine('M4', ['β', 'IV', 'VIII', 'II'], 'C Thin');
				assert.equal(enigma.cipher('A'), 'S', "Enigma with rotor set Beta, IV, VIII, II and reflector C Thin encodes A to S");	
				enigma = new EnigmaMachine('M4', [['β', 4], ['IV', 6], ['VIII', 16], ['II', 13]], 'C Thin');
				assert.equal(enigma.cipher('A'), 'K', "Enigma with rotor set Beta ground 4, IV ground 6, VIII ground 16, II ground 13 and reflector C Thin encodes A to K");
				enigma = new EnigmaMachine('M4', [['β', 0, 19], ['IV', 0, 23], ['VIII', 0, 2], ['II', 0, 11]], 'C Thin');
				assert.equal(enigma.cipher('A'), 'W', "Enigma with rotor set Beta ring 19, IV ring 23, VIII ring 2, II ring 11 and reflector C Thin encodes A to W");
				enigma = new EnigmaMachine('M4', [['β', 1, 19], ['IV', 1, 23], ['VIII', 1, 2], ['II', 1, 11]], 'C Thin');
				assert.equal(enigma.cipher('A'), 'Q', "Enigma with rotor set Beta ground 1 ring 19, IV ground 1 ring 23, VIII ground 1 ring 2, II ground 1 ring 11 and reflector C Thin encodes A to Q");
				enigma = new EnigmaMachine('M4', [['β', 25, 19], ['IV', 25, 23], ['VIII', 25, 2], ['II', 25, 11]], 'C Thin');
				assert.equal(enigma.cipher('A'), 'I', "Enigma with rotor set Beta ground 25 ring 19, IV ground 25 ring 23, VIII ground 25 ring 2, II ground 25 ring 11 and reflector C Thin encodes A to I");
				enigma = new EnigmaMachine('M4', [['β', 4, 19], ['IV', 6, 23], ['VIII', 16, 2], ['II', 13, 11]], 'C Thin');
				assert.equal(enigma.cipher('A'), 'P', "Enigma with rotor set Beta ground 4 ring 19, IV ground 6 ring 23, VIII ground 16 ring 2, II ground 13 ring 11 and reflector C Thin encodes A to P");			
				enigma = new EnigmaMachine('M4', [['β', 4, 19], ['IV', 6, 23], ['VIII', 16, 2], ['II', 13, 11]], 'C Thin', ['AT', 'BP', 'CY', 'EO', 'FX', 'HI', 'JS', 'KL', 'MZ', 'UV']);
				assert.equal(enigma.cipher('A'), 'C', "Enigma with rotor set Beta ground 4 ring 19, IV ground 6 ring 23, VIII ground 16 ring 2, II ground 13 ring 11, reflector C Thin and plugboard A<>T, B<>P, C<>Y, E<>O, F<>X, H<>I, J<>S, K<>L, M<>Z, U<>Z encodes A to C");			
				enigma = new EnigmaMachine('M4', [['β', 4, 19], ['IV', 6, 23], ['VIII', 16, 2], ['II', 13, 11]], 'C Thin', ['AT', 'BP', 'CY', 'EO', 'FX', 'HI', 'JS', 'KL', 'MZ', 'UV']);
				assert.equal(enigma.cipher('THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG'), 'BPVJRKDUZEZVOTYZNYCEFVFFDSLZGYQWJPF', "Enigma with rotor set Beta ground 4 ring 19, IV ground 6 ring 23, VIII ground 16 ring 2, II ground 13 ring 11, reflector C Thin and plugboard A<>T, B<>P, C<>Y, E<>O, F<>X, H<>I, J<>S, K<>L, M<>Z, U<>Z encodes THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG to BPVJRKDUZEZVOTYZNYCEFVFFDSLZGYQWJPF");
				enigma = new EnigmaMachine('M4', [['β', 4, 19], ['IV', 6, 23], ['VIII', 16, 2], ['II', 13, 11]], 'C Thin', ['AT', 'BP', 'CY', 'EO', 'FX', 'HI', 'JS', 'KL', 'MZ', 'UV']);
				assert.equal(enigma.cipher('BPVJRKDUZEZVOTYZNYCEFVFFDSLZGYQWJPF'), 'THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG', "Enigma with rotor set Beta ground 4 ring 19, IV ground 6 ring 23, VIII ground 16 ring 2, II ground 13 ring 11, reflector C Thin and plugboard A<>T, B<>P, C<>Y, E<>O, F<>X, H<>I, J<>S, K<>L, M<>Z, U<>Z encodes BPVJRKDUZEZVOTYZNYCEFVFFDSLZGYQWJPF to THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG");
			});

			QUnit.module("Enigma Models");
			QUnit.test("Enigma D", function(assert){
				var enigma = new EnigmaMachine('D', ['I', 'II', 'III'], 'UKW');
				assert.equal(enigma.cog_stepping, false, "It uses ratchet stepping");
				assert.equal(enigma.has_plugboard, false, "It does not have a plugboard");
				assert.equal(Object.keys(enigma.available_rotors).length, 3, "3 Rotors available");
				assert.equal(Object.keys(enigma.available_reflectors).length, 1, "1 Reflector wheel available");				
				assert.deepEqual(enigma.entry_wheel.wire_map, 'QWERTZUIOASDFGHJKPYXCVBNML'.split(''), 'Entry wheel');				
				assert.deepEqual(enigma.available_rotors.I.cipher_map, 'LPGSZMHAEOQKVXRFYBUTNICJDW', "Rotor I");
				assert.deepEqual(enigma.available_rotors.I.turnover_positions, 'Y', "Rotor I");
				assert.deepEqual(enigma.available_rotors.II.cipher_map, 'SLVGBTFXJQOHEWIRZYAMKPCNDU', "Rotor II");
				assert.deepEqual(enigma.available_rotors.II.turnover_positions, 'E', "Rotor II");
				assert.deepEqual(enigma.available_rotors.III.cipher_map, 'CJGDPSHKTURAWZXFMYNQOBVLIE', "Rotor III");
				assert.deepEqual(enigma.available_rotors.III.turnover_positions, 'N', "Rotor III");	
				assert.deepEqual(enigma.available_reflectors.UKW, 'IMETCGFRAYSQBZXWLHKDVUPOJN', "Reflector Wheel");
				assert.equal(enigma.cipher('A'), 'H', "Enigma D with rotors I, II, III ciphers A to H");
			});
			QUnit.test("Enigma I", function(assert){
				var enigma = new EnigmaMachine('I', ['I', 'II', 'III'], 'A');
				assert.equal(enigma.cog_stepping, false, "It uses ratchet stepping");
				assert.equal(enigma.has_plugboard, true, "It has a plugboard");
				assert.equal(Object.keys(enigma.available_rotors).length, 5, "5 Rotors available");
				assert.equal(Object.keys(enigma.available_reflectors).length, 4, "4 Reflector wheels available");					
				assert.deepEqual(enigma.entry_wheel.wire_map, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), 'Entry wheel');
				assert.deepEqual(enigma.available_rotors.I.cipher_map, 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', "Rotor I");
				assert.deepEqual(enigma.available_rotors.I.turnover_positions, 'Q', "Rotor I");
				assert.deepEqual(enigma.available_rotors.II.cipher_map, 'AJDKSIRUXBLHWTMCQGZNPYFVOE', "Rotor II");
				assert.deepEqual(enigma.available_rotors.II.turnover_positions, 'E', "Rotor II");
				assert.deepEqual(enigma.available_rotors.III.cipher_map, 'BDFHJLCPRTXVZNYEIWGAKMUSQO', "Rotor III");
				assert.deepEqual(enigma.available_rotors.III.turnover_positions, 'V', "Rotor III");
				assert.deepEqual(enigma.available_rotors.IV.cipher_map, 'ESOVPZJAYQUIRHXLNFTGKDCMWB', "Rotor IV");
				assert.deepEqual(enigma.available_rotors.IV.turnover_positions, 'J', "Rotor IV");
				assert.deepEqual(enigma.available_rotors.V.cipher_map, 'VZBRGITYUPSDNHLXAWMJQOFECK', "Rotor V");
				assert.deepEqual(enigma.available_rotors.V.turnover_positions, 'Z', "Rotor V");		
				assert.deepEqual(enigma.available_reflectors.A, 'EJMZALYXVBWFCRQUONTSPIKHGD', "Reflector Wheel A");
				assert.deepEqual(enigma.available_reflectors.B, 'YRUHQSLDPXNGOKMIEBFZCWVJAT', "Reflector Wheel B");
				assert.deepEqual(enigma.available_reflectors.C, 'FVPJIAOYEDRZXWGCTKUQSBNMHL', "Reflector Wheel C");
				assert.equal(enigma.cipher('A'), 'S', "Enigma I with rotors I, II, III and reflector A ciphers A to S");
			});
			QUnit.test("Norway Enigma (Norenigma)", function(assert){
				var enigma = new EnigmaMachine('Norway Enigma', ['I', 'II', 'III'], 'UKW');
				assert.equal(enigma.cog_stepping, false, "It uses ratchet stepping");
				assert.equal(enigma.has_plugboard, true, "It has a plugboard");
				assert.equal(Object.keys(enigma.available_rotors).length, 5, "5 Rotors available");
				assert.equal(Object.keys(enigma.available_reflectors).length, 1, "1 Reflector wheel available");					
				assert.deepEqual(enigma.entry_wheel.wire_map, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), 'Entry wheel');
				assert.deepEqual(enigma.available_rotors.I.cipher_map, 'WTOKASUYVRBXJHQCPZEFMDINLG', "Rotor I");
				assert.deepEqual(enigma.available_rotors.I.turnover_positions, 'Q', "Rotor I");
				assert.deepEqual(enigma.available_rotors.II.cipher_map, 'GJLPUBSWEMCTQVHXAOFZDRKYNI', "Rotor II");
				assert.deepEqual(enigma.available_rotors.II.turnover_positions, 'E', "Rotor II");
				assert.deepEqual(enigma.available_rotors.III.cipher_map, 'JWFMHNBPUSDYTIXVZGRQLAOEKC', "Rotor III");
				assert.deepEqual(enigma.available_rotors.III.turnover_positions, 'V', "Rotor III");
				assert.deepEqual(enigma.available_rotors.IV.cipher_map, 'ESOVPZJAYQUIRHXLNFTGKDCMWB', "Rotor IV");
				assert.deepEqual(enigma.available_rotors.IV.turnover_positions, 'J', "Rotor IV");
				assert.deepEqual(enigma.available_rotors.V.cipher_map, 'HEJXQOTZBVFDASCILWPGYNMURK', "Rotor V");
				assert.deepEqual(enigma.available_rotors.V.turnover_positions, 'Z', "Rotor V");		
				assert.deepEqual(enigma.available_reflectors.UKW, 'MOWJYPUXNDSRAIBFVLKZGQCHET', "UKW");
				assert.equal(enigma.cipher('A'), 'Q', "Norway Enigma with rotors I, II, III ciphers A to Q");
			});			
			QUnit.test("Enigma M3", function(assert){
				var enigma = new EnigmaMachine('M3', ['I', 'II', 'III'], 'B');
				assert.equal(enigma.cog_stepping, false, "It uses ratchet stepping");
				assert.equal(enigma.has_plugboard, true, "It has a plugboard");
				assert.equal(Object.keys(enigma.available_rotors).length, 8, "8 Rotors available");
				assert.equal(Object.keys(enigma.available_reflectors).length, 3, "3 Reflector wheels available");					
				assert.deepEqual(enigma.entry_wheel.wire_map, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), 'Entry wheel');
				assert.deepEqual(enigma.available_rotors.I.cipher_map, 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', "Rotor I");
				assert.deepEqual(enigma.available_rotors.I.turnover_positions, 'Q', "Rotor I");
				assert.deepEqual(enigma.available_rotors.II.cipher_map, 'AJDKSIRUXBLHWTMCQGZNPYFVOE', "Rotor II");
				assert.deepEqual(enigma.available_rotors.II.turnover_positions, 'E', "Rotor II");
				assert.deepEqual(enigma.available_rotors.III.cipher_map, 'BDFHJLCPRTXVZNYEIWGAKMUSQO', "Rotor III");
				assert.deepEqual(enigma.available_rotors.III.turnover_positions, 'V', "Rotor III");
				assert.deepEqual(enigma.available_rotors.IV.cipher_map, 'ESOVPZJAYQUIRHXLNFTGKDCMWB', "Rotor IV");
				assert.deepEqual(enigma.available_rotors.IV.turnover_positions, 'J', "Rotor IV");
				assert.deepEqual(enigma.available_rotors.V.cipher_map, 'VZBRGITYUPSDNHLXAWMJQOFECK', "Rotor V");
				assert.deepEqual(enigma.available_rotors.V.turnover_positions, 'Z', "Rotor V");
				assert.deepEqual(enigma.available_rotors.VI.cipher_map, 'JPGVOUMFYQBENHZRDKASXLICTW', "Rotor VI");
				assert.deepEqual(enigma.available_rotors.VI.turnover_positions, 'ZM', "Rotor VI");
				assert.deepEqual(enigma.available_rotors.VII.cipher_map, 'NZJHGRCXMYSWBOUFAIVLPEKQDT', "Rotor VII");
				assert.deepEqual(enigma.available_rotors.VII.turnover_positions, 'ZM', "Rotor VII");
				assert.deepEqual(enigma.available_rotors.VIII.cipher_map, 'FKQHTLXOCBJSPDZRAMEWNIUYGV', "Rotor VIII");			
				assert.deepEqual(enigma.available_rotors.VIII.turnover_positions, 'ZM', "Rotor VIII");			
				assert.deepEqual(enigma.available_reflectors.B, 'YRUHQSLDPXNGOKMIEBFZCWVJAT', "Reflector Wheel B");
				assert.deepEqual(enigma.available_reflectors.C, 'FVPJIAOYEDRZXWGCTKUQSBNMHL', "Reflector Wheel C");
				assert.equal(enigma.cipher('A'), 'B', "Enigma M3 with rotors I, II, III and reflector B ciphers A to B");
			});
			QUnit.test("Enigma M4", function(assert){
				var enigma = new EnigmaMachine('M4', ['β', 'I', 'II', 'III'], 'B Thin');
				assert.equal(enigma.cog_stepping, false, "It uses ratchet stepping");
				assert.equal(enigma.has_plugboard, true, "It has a plugboard");
				assert.equal(Object.keys(enigma.available_rotors).length, 10, "10 Rotors available");
				assert.equal(Object.keys(enigma.available_reflectors).length, 3, "3 Reflector wheels available");					
				assert.deepEqual(enigma.entry_wheel.wire_map, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), 'Entry wheel');
				assert.deepEqual(enigma.available_rotors.I.cipher_map, 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', "Rotor I");
				assert.deepEqual(enigma.available_rotors.I.turnover_positions, 'Q', "Rotor I");
				assert.deepEqual(enigma.available_rotors.II.cipher_map, 'AJDKSIRUXBLHWTMCQGZNPYFVOE', "Rotor II");
				assert.deepEqual(enigma.available_rotors.II.turnover_positions, 'E', "Rotor II");
				assert.deepEqual(enigma.available_rotors.III.cipher_map, 'BDFHJLCPRTXVZNYEIWGAKMUSQO', "Rotor III");
				assert.deepEqual(enigma.available_rotors.III.turnover_positions, 'V', "Rotor III");
				assert.deepEqual(enigma.available_rotors.IV.cipher_map, 'ESOVPZJAYQUIRHXLNFTGKDCMWB', "Rotor IV");
				assert.deepEqual(enigma.available_rotors.IV.turnover_positions, 'J', "Rotor IV");
				assert.deepEqual(enigma.available_rotors.V.cipher_map, 'VZBRGITYUPSDNHLXAWMJQOFECK', "Rotor V");
				assert.deepEqual(enigma.available_rotors.V.turnover_positions, 'Z', "Rotor V");
				assert.deepEqual(enigma.available_rotors.VI.cipher_map, 'JPGVOUMFYQBENHZRDKASXLICTW', "Rotor VI");
				assert.deepEqual(enigma.available_rotors.VI.turnover_positions, 'ZM', "Rotor VI");
				assert.deepEqual(enigma.available_rotors.VII.cipher_map, 'NZJHGRCXMYSWBOUFAIVLPEKQDT', "Rotor VII");
				assert.deepEqual(enigma.available_rotors.VII.turnover_positions, 'ZM', "Rotor VII");
				assert.deepEqual(enigma.available_rotors.VIII.cipher_map, 'FKQHTLXOCBJSPDZRAMEWNIUYGV', "Rotor VIII");			
				assert.deepEqual(enigma.available_rotors.VIII.turnover_positions, 'ZM', "Rotor VIII");			
				assert.deepEqual(enigma.available_rotors.β.cipher_map, 'LEYJVCNIXWPBQMDRTAKZGFUHOS', "Rotor β");
				assert.deepEqual(enigma.available_rotors.β.turnover_positions, '', "Rotor β");					
				assert.deepEqual(enigma.available_rotors.γ.cipher_map, 'FSOKANUERHMBTIYCWLQPZXVGJD', "Rotor γ");
				assert.deepEqual(enigma.available_rotors.γ.turnover_positions, '', "Rotor γ");					
				assert.deepEqual(enigma.available_reflectors['B Thin'], 'ENKQAUYWJICOPBLMDXZVFTHRGS', "Reflector Wheel B Thin");
				assert.deepEqual(enigma.available_reflectors['C Thin'], 'RDOBJNTKVEHMLFCWZAXGYIPSUQ', "Reflector Wheel C Thin");
				assert.equal(enigma.cipher('A'), 'B', "Enigma M4 with rotors β, I, II, III and reflector B Thin ciphers A to B");
				var enigma = new EnigmaMachine('M4', ['β', 'I', 'II', 'III'], 'D');
				assert.equal(enigma.cipher('A'), 'E', "Enigma M4 with D reflector should disable the thin rotor");
			});
			QUnit.test("Zählwerk Enigma (A-865)", function(assert){
				var enigma = new EnigmaMachine('Zählwerk', ['I', 'II', 'III'], 'UKW');
				assert.equal(enigma.cog_stepping, true, "It uses cog stepping");
				assert.equal(enigma.has_plugboard, false, "It does not have a plugboard");
				assert.equal(Object.keys(enigma.available_rotors).length, 3, "3 Rotors available");
				assert.equal(Object.keys(enigma.available_reflectors).length, 1, "1 Reflector wheel available");				
				assert.deepEqual(enigma.entry_wheel.wire_map, 'QWERTZUIOASDFGHJKPYXCVBNML'.split(''), 'Entry wheel');				
				assert.deepEqual(enigma.available_rotors.I.cipher_map, 'LPGSZMHAEOQKVXRFYBUTNICJDW', "Rotor I");
				assert.deepEqual(enigma.available_rotors.I.turnover_positions, 'SUVWZABCEFGIKLOPQ', "Rotor I");
				assert.deepEqual(enigma.available_rotors.II.cipher_map, 'SLVGBTFXJQOHEWIRZYAMKPCNDU', "Rotor II");
				assert.deepEqual(enigma.available_rotors.II.turnover_positions, 'STVYZACDFGHKMNQ', "Rotor II");
				assert.deepEqual(enigma.available_rotors.III.cipher_map, 'CJGDPSHKTURAWZXFMYNQOBVLIE', "Rotor III");
				assert.deepEqual(enigma.available_rotors.III.turnover_positions, 'UWXAEFHKMNR', "Rotor III");	
				assert.deepEqual(enigma.available_reflectors.UKW, 'IMETCGFRAYSQBZXWLHKDVUPOJN', "Reflector Wheel");
				assert.equal(enigma.cipher('A'), 'H', "Zählwerk Enigma with rotors I, II, III ciphers A to H");
			});
			QUnit.test("G", function(assert){
				var enigma = new EnigmaMachine('G', ['I', 'II', 'III'], 'UKW');
				assert.equal(enigma.cog_stepping, true, "It uses cog stepping");
				assert.equal(enigma.has_plugboard, false, "It does not have a plugboard");
				assert.equal(Object.keys(enigma.available_rotors).length, 3, "3 Rotors available");
				assert.equal(Object.keys(enigma.available_reflectors).length, 1, "1 Reflector wheel available");				
				assert.deepEqual(enigma.entry_wheel.wire_map, 'QWERTZUIOASDFGHJKPYXCVBNML'.split(''), 'Entry wheel');				
				assert.deepEqual(enigma.available_rotors.I.cipher_map, 'LPGSZMHAEOQKVXRFYBUTNICJDW', "Rotor I");
				assert.deepEqual(enigma.available_rotors.I.turnover_positions, 'SUVWZABCEFGIKLOPQ', "Rotor I");
				assert.deepEqual(enigma.available_rotors.II.cipher_map, 'SLVGBTFXJQOHEWIRZYAMKPCNDU', "Rotor II");
				assert.deepEqual(enigma.available_rotors.II.turnover_positions, 'STVYZACDFGHKMNQ', "Rotor II");
				assert.deepEqual(enigma.available_rotors.III.cipher_map, 'CJGDPSHKTURAWZXFMYNQOBVLIE', "Rotor III");
				assert.deepEqual(enigma.available_rotors.III.turnover_positions, 'UWXAEFHKMNR', "Rotor III");	
				assert.deepEqual(enigma.available_reflectors.UKW, 'IMETCGFRAYSQBZXWLHKDVUPOJN', "Reflector Wheel");
				assert.equal(enigma.cipher('A'), 'H', "Enigma G with rotors I, II, III ciphers A to H");
			});
			QUnit.test("G-111", function(assert){
				var enigma = new EnigmaMachine('G-111', ['I', 'II', 'V'], 'UKW');
				assert.equal(enigma.cog_stepping, true, "It uses cog stepping");
				assert.equal(enigma.has_plugboard, false, "It does not have a plugboard");
				assert.equal(Object.keys(enigma.available_rotors).length, 3, "3 Rotors available");
				assert.equal(Object.keys(enigma.available_reflectors).length, 1, "1 Reflector wheel available");				
				assert.deepEqual(enigma.entry_wheel.wire_map, 'QWERTZUIOASDFGHJKPYXCVBNML'.split(''), 'Entry wheel');				
				assert.deepEqual(enigma.available_rotors.I.cipher_map, 'WLRHBQUNDKJCZSEXOTMAGYFPVI', "Rotor I");
				assert.deepEqual(enigma.available_rotors.I.turnover_positions, 'SUVWZABCEFGIKLOPQ', "Rotor I");
				assert.deepEqual(enigma.available_rotors.II.cipher_map, 'TFJQAZWMHLCUIXRDYGOEVBNSKP', "Rotor II");
				assert.deepEqual(enigma.available_rotors.II.turnover_positions, 'STVYZACDFGHKMNQ', "Rotor II");
				assert.deepEqual(enigma.available_rotors.V.cipher_map, 'QTPIXWVDFRMUSLJOHCANEZKYBG', "Rotor V");
				assert.deepEqual(enigma.available_rotors.V.turnover_positions, 'SWZFHMQ', "Rotor V");	
				assert.deepEqual(enigma.available_reflectors.UKW, 'IMETCGFRAYSQBZXWLHKDVUPOJN', "Reflector Wheel");
				assert.equal(enigma.cipher('A'), 'J', "Enigma G-111 with rotors I, II, III ciphers A to J");
			});
			QUnit.test("G-260", function(assert){
				var enigma = new EnigmaMachine('G-260', ['I', 'II', 'III'], 'UKW');
				assert.equal(enigma.cog_stepping, true, "It uses cog stepping");
				assert.equal(enigma.has_plugboard, false, "It does not have a plugboard");
				assert.equal(Object.keys(enigma.available_rotors).length, 3, "3 Rotors available");
				assert.equal(Object.keys(enigma.available_reflectors).length, 1, "1 Reflector wheel available");				
				assert.deepEqual(enigma.entry_wheel.wire_map, 'QWERTZUIOASDFGHJKPYXCVBNML'.split(''), 'Entry wheel');				
				assert.deepEqual(enigma.available_rotors.I.cipher_map, 'RCSPBLKQAUMHWYTIFZVGOJNEXD', "Rotor I");
				assert.deepEqual(enigma.available_rotors.I.turnover_positions, 'SUVWZABCEFGIKLOPQ', "Rotor I");
				assert.deepEqual(enigma.available_rotors.II.cipher_map, 'WCMIBVPJXAROSGNDLZKEYHUFQT', "Rotor II");
				assert.deepEqual(enigma.available_rotors.II.turnover_positions, 'STVYZACDFGHKMNQ', "Rotor II");
				assert.deepEqual(enigma.available_rotors.III.cipher_map, 'FVDHZELSQMAXOKYIWPGCBUJTNR', "Rotor III");
				assert.deepEqual(enigma.available_rotors.III.turnover_positions, 'UWXAEFHKMNR', "Rotor III");	
				assert.deepEqual(enigma.available_reflectors.UKW, 'IMETCGFRAYSQBZXWLHKDVUPOJN', "Reflector Wheel");
				assert.equal(enigma.cipher('A'), 'F', "Enigma G-260 with rotors I, II, III ciphers A to F");
			});
			QUnit.test("G-312", function(assert){
				var enigma = new EnigmaMachine('G-312', ['I', 'II', 'III'], 'UKW');
				assert.equal(enigma.cog_stepping, true, "It uses cog stepping");
				assert.equal(enigma.has_plugboard, false, "It does not have a plugboard");
				assert.equal(Object.keys(enigma.available_rotors).length, 3, "3 Rotors available");
				assert.equal(Object.keys(enigma.available_reflectors).length, 1, "1 Reflector wheel available");				
				assert.deepEqual(enigma.entry_wheel.wire_map, 'QWERTZUIOASDFGHJKPYXCVBNML'.split(''), 'Entry wheel');				
				assert.deepEqual(enigma.available_rotors.I.cipher_map, 'DMTWSILRUYQNKFEJCAZBPGXOHV', "Rotor I");
				assert.deepEqual(enigma.available_rotors.I.turnover_positions, 'SUVWZABCEFGIKLOPQ', "Rotor I");
				assert.deepEqual(enigma.available_rotors.II.cipher_map, 'HQZGPJTMOBLNCIFDYAWVEUSRKX', "Rotor II");
				assert.deepEqual(enigma.available_rotors.II.turnover_positions, 'STVYZACDFGHKMNQ', "Rotor II");
				assert.deepEqual(enigma.available_rotors.III.cipher_map, 'UQNTLSZFMREHDPXKIBVYGJCWOA', "Rotor III");
				assert.deepEqual(enigma.available_rotors.III.turnover_positions, 'UWXAEFHKMNR', "Rotor III");	
				assert.deepEqual(enigma.available_reflectors.UKW, 'RULQMZJSYGOCETKWDAHNBXPVIF', "Reflector Wheel");
				assert.equal(enigma.cipher('A'), 'E', "Enigma G-312 with rotors I, II, III ciphers A to E");
			});	
			QUnit.test("Enigma K", function(assert){
				var enigma = new EnigmaMachine('K', ['I', 'II', 'III'], 'UKW');
				assert.equal(enigma.cog_stepping, false, "It uses ratchet stepping");
				assert.equal(enigma.has_plugboard, false, "It does not have a plugboard");
				assert.equal(Object.keys(enigma.available_rotors).length, 3, "3 Rotors available");
				assert.equal(Object.keys(enigma.available_reflectors).length, 1, "1 Reflector wheel available");				
				assert.deepEqual(enigma.entry_wheel.wire_map, 'QWERTZUIOASDFGHJKPYXCVBNML'.split(''), 'Entry wheel');				
				assert.deepEqual(enigma.available_rotors.I.cipher_map, 'LPGSZMHAEOQKVXRFYBUTNICJDW', "Rotor I");
				assert.deepEqual(enigma.available_rotors.I.turnover_positions, 'Y', "Rotor I");
				assert.deepEqual(enigma.available_rotors.II.cipher_map, 'SLVGBTFXJQOHEWIRZYAMKPCNDU', "Rotor II");
				assert.deepEqual(enigma.available_rotors.II.turnover_positions, 'E', "Rotor II");
				assert.deepEqual(enigma.available_rotors.III.cipher_map, 'CJGDPSHKTURAWZXFMYNQOBVLIE', "Rotor III");
				assert.deepEqual(enigma.available_rotors.III.turnover_positions, 'N', "Rotor III");	
				assert.deepEqual(enigma.available_reflectors.UKW, 'IMETCGFRAYSQBZXWLHKDVUPOJN', "Reflector Wheel");
				assert.equal(enigma.cipher('A'), 'H', "Enigma K with rotors I, II, III ciphers A to H");
			});
			QUnit.test("Swiss-K", function(assert){
				var enigma = new EnigmaMachine('Swiss-K', ['I', 'II', 'III'], 'UKW');
				assert.equal(enigma.cog_stepping, false, "It uses ratchet stepping");
				assert.equal(enigma.has_plugboard, false, "It does not have a plugboard");
				assert.equal(Object.keys(enigma.available_rotors).length, 3, "3 Rotors available");
				assert.equal(Object.keys(enigma.available_reflectors).length, 1, "1 Reflector wheel available");				
				assert.deepEqual(enigma.entry_wheel.wire_map, 'QWERTZUIOASDFGHJKPYXCVBNML'.split(''), 'Entry wheel');				
				assert.deepEqual(enigma.available_rotors.I.cipher_map, 'PEZUOHXSCVFMTBGLRINQJWAYDK', "Rotor I");
				assert.deepEqual(enigma.available_rotors.I.turnover_positions, 'Y', "Rotor I");
				assert.deepEqual(enigma.available_rotors.II.cipher_map, 'ZOUESYDKFWPCIQXHMVBLGNJRAT', "Rotor II");
				assert.deepEqual(enigma.available_rotors.II.turnover_positions, 'E', "Rotor II");
				assert.deepEqual(enigma.available_rotors.III.cipher_map, 'EHRVXGAOBQUSIMZFLYNWKTPDJC', "Rotor III");
				assert.deepEqual(enigma.available_rotors.III.turnover_positions, 'N', "Rotor III");	
				assert.deepEqual(enigma.available_reflectors.UKW, 'IMETCGFRAYSQBZXWLHKDVUPOJN', "Reflector Wheel");
				assert.equal(enigma.cipher('A'), 'Y', "Swiss-K with rotors I, II, III ciphers A to Y");
			});		
			QUnit.test("Enigma KD", function(assert){
				var enigma = new EnigmaMachine('KD', ['I', 'II', 'III'], 'UKW');
				assert.equal(enigma.cog_stepping, false, "It uses ratchet stepping");
				assert.equal(enigma.has_plugboard, false, "It does not have a plugboard");
				assert.equal(Object.keys(enigma.available_rotors).length, 3, "3 Rotors available");
				assert.equal(Object.keys(enigma.available_reflectors).length, 1, "1 Reflector wheel available");				
				assert.deepEqual(enigma.entry_wheel.wire_map, 'QWERTZUIOASDFGHJKPYXCVBNML'.split(''), 'Entry wheel');				
				assert.deepEqual(enigma.available_rotors.I.cipher_map, 'VEZIOJCXKYDUNTWAPLQGBHSFMR', "Rotor I");
				assert.deepEqual(enigma.available_rotors.I.turnover_positions, 'SUYAEHLNQ', "Rotor I");
				assert.deepEqual(enigma.available_rotors.II.cipher_map, 'HGRBSJZETDLVPMQYCXAOKINFUW', "Rotor II");
				assert.deepEqual(enigma.available_rotors.II.turnover_positions, 'SUYAEHLNQ', "Rotor II");
				assert.deepEqual(enigma.available_rotors.III.cipher_map, 'NWLHXGRBYOJSAZDVTPKFQMEUIC', "Rotor III");
				assert.deepEqual(enigma.available_rotors.III.turnover_positions, 'SUYAEHLNQ', "Rotor III");	
				assert.deepEqual(enigma.available_reflectors.UKW, 'KOTVPNLMJIAGHFBEWYXCZDQSRU', "Reflector Wheel");
				assert.equal(enigma.cipher('A'), 'L', "Enigma KD with rotors I, II, III ciphers A to L");
			});
			QUnit.test("Railway Enigma", function(assert){
				var enigma = new EnigmaMachine('Railway Enigma', ['I', 'II', 'III'], 'UKW');
				assert.equal(enigma.cog_stepping, false, "It uses ratchet stepping");
				assert.equal(enigma.has_plugboard, false, "It does not have a plugboard");
				assert.equal(Object.keys(enigma.available_rotors).length, 3, "3 Rotors available");
				assert.equal(Object.keys(enigma.available_reflectors).length, 1, "1 Reflector wheel available");				
				assert.deepEqual(enigma.entry_wheel.wire_map, 'QWERTZUIOASDFGHJKPYXCVBNML'.split(''), 'Entry wheel');				
				assert.deepEqual(enigma.available_rotors.I.cipher_map, 'JGDQOXUSCAMIFRVTPNEWKBLZYH', "Rotor I");
				assert.deepEqual(enigma.available_rotors.I.turnover_positions, 'N', "Rotor I");
				assert.deepEqual(enigma.available_rotors.II.cipher_map, 'NTZPSFBOKMWRCJDIVLAEYUXHGQ', "Rotor II");
				assert.deepEqual(enigma.available_rotors.II.turnover_positions, 'E', "Rotor II");
				assert.deepEqual(enigma.available_rotors.III.cipher_map, 'JVIUBHTCDYAKEQZPOSGXNRMWFL', "Rotor III");
				assert.deepEqual(enigma.available_rotors.III.turnover_positions, 'Y', "Rotor III");	
				assert.deepEqual(enigma.available_reflectors.UKW, 'QYHOGNECVPUZTFDJAXWMKISRBL', "Reflector Wheel");
				assert.equal(enigma.cipher('A'), 'Z', "Railway Enigma with rotors I, II, III ciphers A to Z");
			});			
			QUnit.test("Enigma T (Tirpitz)", function(assert){
				var enigma = new EnigmaMachine('T', ['I', 'II', 'III'], 'UKW');
				assert.equal(enigma.cog_stepping, false, "It uses ratchet stepping");
				assert.equal(enigma.has_plugboard, false, "It does not have a plugboard");
				assert.equal(Object.keys(enigma.available_rotors).length, 8, "8 Rotors available");
				assert.equal(Object.keys(enigma.available_reflectors).length, 1, "1 Reflector wheel available");					
				assert.deepEqual(enigma.entry_wheel.wire_map, 'KZROUQHYAIGBLWVSTDXFPNMCJE'.split(''), 'Entry wheel');
				assert.deepEqual(enigma.available_rotors.I.cipher_map, 'KPTYUELOCVGRFQDANJMBSWHZXI', "Rotor I");
				assert.deepEqual(enigma.available_rotors.I.turnover_positions, 'WZEKQ', "Rotor I");
				assert.deepEqual(enigma.available_rotors.II.cipher_map, 'UPHZLWEQMTDJXCAKSOIGVBYFNR', "Rotor II");
				assert.deepEqual(enigma.available_rotors.II.turnover_positions, 'WZFLR', "Rotor II");
				assert.deepEqual(enigma.available_rotors.III.cipher_map, 'QUDLYRFEKONVZAXWHMGPJBSICT', "Rotor III");
				assert.deepEqual(enigma.available_rotors.III.turnover_positions, 'WZEKQ', "Rotor III");
				assert.deepEqual(enigma.available_rotors.IV.cipher_map, 'CIWTBKXNRESPFLYDAGVHQUOJZM', "Rotor IV");
				assert.deepEqual(enigma.available_rotors.IV.turnover_positions, 'WZFLR', "Rotor IV");
				assert.deepEqual(enigma.available_rotors.V.cipher_map, 'UAXGISNJBVERDYLFZWTPCKOHMQ', "Rotor V");
				assert.deepEqual(enigma.available_rotors.V.turnover_positions, 'YCFKR', "Rotor V");
				assert.deepEqual(enigma.available_rotors.VI.cipher_map, 'XFUZGALVHCNYSEWQTDMRBKPIOJ', "Rotor VI");
				assert.deepEqual(enigma.available_rotors.VI.turnover_positions, 'XEIMQ', "Rotor VI");
				assert.deepEqual(enigma.available_rotors.VII.cipher_map, 'BJVFTXPLNAYOZIKWGDQERUCHSM', "Rotor VII");
				assert.deepEqual(enigma.available_rotors.VII.turnover_positions, 'YCFKR', "Rotor VII");
				assert.deepEqual(enigma.available_rotors.VIII.cipher_map, 'YMTPNZHWKODAJXELUQVGCBISFR', "Rotor VIII");			
				assert.deepEqual(enigma.available_rotors.VIII.turnover_positions, 'XEIMQ', "Rotor VIII");			
				assert.deepEqual(enigma.available_reflectors.UKW, 'GEKPBTAUMOCNILJDXZYFHWVQSR', "Reflector Wheel");	
				assert.equal(enigma.cipher('A'), 'F', "Enigma T with rotors I, II, III ciphers A to F");				
			});		
			
			QUnit.module("Historical Accuracy");
			QUnit.test("It can accurately cipher real, historical enigma messages", function(assert){
				// http://wiki.franklinheath.co.uk/index.php/Enigma/Sample_Messages
				var enigma = new EnigmaMachine('M3',[['II', 1, 1], ['IV', 11, 20], ['V', 0, 11]], 'B', ['AV', 'BS', 'CG', 'DL', 'FU', 'HZ', 'IN', 'KM', 'OW', 'RX']);
				assert.equal(enigma.cipher('EDPUDNRGYSZRCXNUYTPOMRMBOFKTBZREZKMLXLVEFGUEYSIOZVEQMIKUBPMMYLKLTTDEISMDICAGYKUACTCDOMOHWXMUUIAUBSTSLRNBZSZWNRFXWFYSSXJZVIJHIDISHPRKLKAYUPADTXQSPINQMATLPIFSVKDASCTACDPBOPVHJK'), 'AUFKLXABTEILUNGXVONXKURTINOWAXKURTINOWAXNORDWESTLXSEBEZXSEBEZXUAFFLIEGERSTRASZERIQTUNGXDUBROWKIXDUBROWKIXOPOTSCHKAXOPOTSCHKAXUMXEINSAQTDREINULLXUHRANGETRETENXANGRIFFXINFXRGTX', "Operation Barbarossa. Sent from the Russian front on 7th July 1941. Part 1.");
				enigma = new EnigmaMachine('M3',[['II', 11, 1], ['IV', 18, 20], ['V', 3, 11]], 'B', ['AV', 'BS', 'CG', 'DL', 'FU', 'HZ', 'IN', 'KM', 'OW', 'RX']);
				assert.equal(enigma.cipher('SFBWDNJUSEGQOBHKRTAREEZMWKPPRBXOHDROEQGBBGTQVPGVKBVVGBIMHUSZYDAJQIROAXSSSNREHYGGRPISEZBOVMQIEMMZCYSGQDGRERVBILEKXYQIRGIRQNRDNVRXCYYTNJR'), 'DREIGEHTLANGSAMABERSIQERVORWAERTSXEINSSIEBENNULLSEQSXUHRXROEMXEINSXINFRGTXDREIXAUFFLIEGERSTRASZEMITANFANGXEINSSEQSXKMXKMXOSTWXKAMENECXK', "Operation Barbarossa. Sent from the Russian front on 7th July 1941. Part 2.");
				enigma = new EnigmaMachine('M4', [['β', 21, 0], ['II', 9, 0], ['IV', 13, 0], ['I', 0, 21]], 'B Thin', ['AT', 'BL', 'DF', 'GJ', 'HM', 'NW', 'OP', 'QY', 'RZ', 'VX']);
				assert.equal(enigma.cipher('NCZWVUSXPNYMINHZXMQXSFWXWLKJAHSHNMCOCCAKUQPMKCSMHKSEINJUSBLKIOSXCKUBHMLLXCSJUSRRDVKOHULXWCCBGVLIYXEOAHXRHKKFVDREWEZLXOBAFGYUJQUKGRTVUKAMEURBVEKSUHHVOYHABCJWMAKLFKLMYFVNRIZRVVRTKOFDANJMOLBGFFLEOPRGTFLVRHOWOPBEKVWMUQFMPWPARMFHAGKXIIBG'), 'VONVONJLOOKSJHFFTTTEINSEINSDREIZWOYYQNNSNEUNINHALTXXBEIANGRIFFUNTERWASSERGEDRUECKTYWABOSXLETZTERGEGNERSTANDNULACHTDREINULUHRMARQUANTONJOTANEUNACHTSEYHSDREIYZWOZWONULGRADYACHTSMYSTOSSENACHXEKNSVIERMBFAELLTYNNNNNNOOOVIERYSICHTEINSNULL', 'U-264 (Kapitänleutnant Hartwig Looks) - Sent from a U-boat on 25th November 1942, this message was enciphered using their standard-equipment Enigma M4 machine.');
				enigma = new EnigmaMachine('M3', [['III', 20, 0], ['VI', 25, 7], ['VIII', 21, 12]], 'B', ['AN', 'EZ', 'HK', 'IJ', 'LR', 'MQ', 'OT', 'PV', 'SW', 'UX']);
				assert.equal(enigma.cipher('YKAENZAPMSCHZBFOCUVMRMDPYCOFHADZIZMEFXTHFLOLPZLFGGBOTGOXGRETDWTJIQHLMXVJWKZUASTR'), 'STEUEREJTANAFJORDJANSTANDORTQUAAACCCVIERNEUNNEUNZWOFAHRTZWONULSMXXSCHARNHORSTHCO', 'Scharnhorst (Konteradmiral Erich Bey) - This message was sent from the battleship Scharnhorst on 26th December 1943, the day on which it was sunk by torpedoes from British destroyers.');
			});
		});
		
		QUnit.module("GUI", function(hooks){
			var gui = {};
			hooks.beforeEach(function(assert){
				gui = new EnigmaMachineGUI();
				var done = assert.async();
				setTimeout(function(){
					done();				
				}, 0);
			});
			
			QUnit.module("Interface");
			QUnit.test("Target elements for option creation exist", function(assert){
				assert.equal($('.enigma-machine-select').length, 1, "Enigma Machine Select");
				assert.equal($('.enigma-machine-step-mechanism').length, 1, "Stepping mechanism");
				assert.equal($('.enigma-machine-plugboard-available').length, 1, "Plugboard available");
				assert.equal($('.enigma-machine-plugboard-uhr').length, 1, "Plugboard UHR");				
				assert.equal($('.plugboard-settings-field').length, 1, "Plugboard Settings");
				assert.equal($('.reflector-select').length, 1, "Reflector Select");
				assert.equal($('.reflector-ground-setting').length, 1, "Reflector Ground Setting");
				assert.equal($('.thin-rotor-select').length, 1, "Thin Rotor Select");
				assert.equal($('.thin-rotor-ring-setting').length, 1, "Thin Rotor Ring Setting");
				assert.equal($('.thin-rotor-ground-setting').length, 1, "Thin Rotor Ground Setting");
				assert.equal($('.slow-rotor-select').length, 1, "Slow Rotor Select");
				assert.equal($('.slow-rotor-ring-setting').length, 1, "Slow Rotor Ring Setting");
				assert.equal($('.slow-rotor-ground-setting').length, 1, "Slow Rotor Ground Setting");
				assert.equal($('.middle-rotor-select').length, 1, "Middle Rotor Select");
				assert.equal($('.middle-rotor-ring-setting').length, 1, "Middle Rotor Ring Setting");
				assert.equal($('.middle-rotor-ground-setting').length, 1, "Middle Rotor Ground Setting");
				assert.equal($('.fast-rotor-select').length, 1, "Fast Rotor Select");
				assert.equal($('.fast-rotor-ring-setting').length, 1, "Fast Rotor Ring Setting");
				assert.equal($('.fast-rotor-ground-setting').length, 1, "Fast Rotor Ground Setting");
			});
			QUnit.test("Target elements for visuals creation exist", function(assert){
				assert.equal($('.reflector').length, 1, "Reflector");
				assert.equal($('.thin-rotor').length, 1, "Thin Rotor");
				assert.equal($('.slow-rotor').length, 1, "Slow Rotor");
				assert.equal($('.middle-rotor').length, 1, "Middle Rotor");
				assert.equal($('.fast-rotor').length, 1, "Fast Rotor");
				assert.equal($('.plugboard').length, 1, "Plugboard");
				assert.equal($('.entry-wheel').length, 1, "Entry Wheel");
				assert.equal($('.plugboard-settings').length, 1, "Plugboard Settings");
			});
			QUnit.test("Target elements for Enigma I/O exist", function(assert){
				assert.equal($('.enigma-io').length, 1, "Enigma I/O");
				assert.equal($('.bulk-text-input').length, 1, "Bulk Text Input");
				assert.equal($('.bulk-text-output').length, 1, "Bulk Text Output");
				assert.equal($('.bulk-text-output').text(), 'Ciphertext output', "Bulk Text Output");
				assert.equal($('.bulk-text-output-clear').length, 1, "Bulk Text Output Clear");
			});
			QUnit.test("Target elements for Enigma control exist", function(assert){
				assert.equal($('.enigma-step').length, 1, "Enigma Step");
				assert.equal($('.enigma-all').length, 1, "Enigma All");
				assert.equal($('.enigma-play').length, 1, "Enigma Play");
				assert.equal($('.enigma-play-x2').length, 1, "Enigma Play x2 Speed");
				assert.equal($('.enigma-play-x10').length, 1, "Enigma Play x10 Speed");
			});
			QUnit.test("Enigma Machine options are created", function(assert){
				assert.equal($('.enigma-machine-select option').length, 15, "15 Enigma machine versions are available");
				assert.equal($('.enigma-machine-select option:selected').val(), 'M4', "M4 is the default setting");
				assert.equal($('.enigma-machine-step-mechanism option').length, 2, "2 Stepping mechanism options are available");
				assert.equal($('.enigma-machine-step-mechanism option:selected').val(), 'ratchet', "Ratchet stepping is the default setting");
				assert.equal($('.enigma-machine-step-mechanism').attr('disabled'), 'disabled', "Ratchet stepping option is disabled by default");
				assert.equal($('.enigma-machine-plugboard-available option').length, 2, "2 plugboard availability options are available");
				assert.equal($('.enigma-machine-plugboard-available option:selected').val(), '1', "Plugboard available is the default setting");
				assert.equal($('.enigma-machine-plugboard-available').attr('disabled'), 'disabled', "Plugboard available is disabled by default");
				assert.equal($('.enigma-machine-plugboard-uhr option').length, 2, "2 Uhr availability options are available");
				assert.equal($('.enigma-machine-plugboard-uhr option:selected').val(), 0, "No Uhr is the default option");
			});
			QUnit.test("Element options are created", function(assert){
				assert.equal($('.plugboard-settings-field input').length, 26, "Plugboard has 26 inputs");
				assert.equal($('.plugboard-settings-field .plugboard-uhr-setting').length, 1, "Plugboard has 1 select for UHR setting");
				assert.equal($('.plugboard-settings-field .plugboard-uhr-setting').attr('disabled'), 'disabled', "Plugboard UHR setting is disabled by default");
				assert.equal($('.reflector-select option').length, 3, "Reflector has all available translation models");
				assert.equal($('.reflector-ground-setting option').length, 26, "Reflector ground setting has 26 options");
				assert.equal($('.reflector-ground-setting').attr('disabled'), 'disabled', "Reflector ground setting is disabled by default");
				assert.equal($('.ukw-d-settings-field input').length, 26, "UKW-D settings has 26 inputs");				
				assert.equal($('.thin-rotor-select option').length, 2, "Thin rotor has all available translation models");
				assert.equal($('.slow-rotor-select option').length, 8, "Slow rotor has all available translation models");
				assert.equal($('.slow-rotor-select option:selected').val(), 'I', "Slow rotor uses rotor I by default");
				assert.equal($('.middle-rotor-select option').length, 8, "Middle rotor has all available translation models");
				assert.equal($('.middle-rotor-select option:selected').val(), 'II', "Middle rotor uses rotor II by default");
				assert.equal($('.fast-rotor-select option').length, 8, "Fast rotor has all available translation models");
				assert.equal($('.fast-rotor-select option:selected').val(), 'III', "Fast rotor uses rotor III by default");
				assert.equal($('.slow-rotor-ring-setting option').length, 26, "Slow rotor ring setting has 26 options");
				assert.equal($('.middle-rotor-ring-setting option').length, 26, "Middle rotor ring setting has 26 options");
				assert.equal($('.fast-rotor-ring-setting option').length, 26, "Fast rotor ring setting has 26 options");
				assert.equal($('.thin-rotor-ground-setting option').length, 26, "Thin rotor ground setting has 26 options");
				assert.equal($('.slow-rotor-ground-setting option').length, 26, "Slow rotor ground setting has 26 options");
				assert.equal($('.middle-rotor-ground-setting option').length, 26, "Middle rotor ground setting has 26 options");
				assert.equal($('.fast-rotor-ground-setting option').length, 26, "Fast rotor ground setting has 26 options");
			});	
			QUnit.test("Interface is updated fully when enigma-machine-select changes", function(assert){
				$('.reflector-select').val('D').trigger('change');
				$('.enigma-machine-select').val('G').trigger('change');
				assert.equal($('.enigma-machine-step-mechanism option:selected').val(), 'cog', "Enigma G uses cog stepping mechanism");
				assert.equal($('.enigma-machine-plugboard-available option:selected').val(), '0', "Enigma G does not have a plugboard");
				assert.equal($('.plugboard-settings').attr('disabled'), 'disabled', "Enigma G does not have a plugboard");
				assert.equal($('.enigma-machine-plugboard-uhr option:selected').val(), '0', "Enigma G does not have a plugboard uhr");
				assert.equal($('.enigma-machine-plugboard-uhr').attr('disabled'), 'disabled', "Enigma G cannot use a plugboard uhr");
				assert.equal($('.reflector-select option').length, 1, "Reflector has one option with Enigma G");
				assert.equal($($('.reflector-select option')[0]).val(), 'UKW', "Reflector for Enigma G is UKW");
				assert.equal($('.reflector-select').attr('disabled'), 'disabled', "Reflector select disabled for Enigma G");
				assert.equal($('.reflector-ground-setting').attr('disabled'), undefined, "Reflector ground setting is not disabled for Enigma G");
				assert.equal($('.ukw-d-settings').is(':visible'), false, "UKW-D settings config button is hidden");
				assert.equal($('.ukw-d-settings').parent().parent().hasClass('input-group'), false, "UKW-D settings config button is hidden");
				assert.equal($('.thin-rotor-select option').length, 0, "Enigma G has 0 available thin rotors");				
				assert.equal($('.slow-rotor-select option').length, 3, "Enigma G has 3 available rotors");				
				assert.equal($('.middle-rotor-select option').length, 3, "Enigma G has 3 available rotors");				
				assert.equal($('.fast-rotor-select option').length, 3, "Enigma G has 3 available rotors");	
				$('.enigma-machine-select').val('M4');
				$('.enigma-machine-select').trigger('change');
				assert.equal($('.thin-rotor-select').attr('disabled'), undefined, "Enigma M4 has thin rotors available");				
				assert.equal($('.thin-rotor-ring-setting').attr('disabled'), undefined, "Enigma M4 has thin rotors available");				
				assert.equal($('.thin-rotor-ground-setting').attr('disabled'), undefined, "Enigma M4 has thin rotors available");				
				assert.equal($('.thin-rotor-select option').length, 2, "Enigma M4 has 2 available thin rotors");
				var done = assert.async();
				setTimeout(function(){
					assert.equal($('.thin-rotor .wire').length, 78, "Enigma M4 thin rotor wires");
					done();
				}, 0);
				assert.equal($('.thin-rotor .contacts').parent().hasClass('text-muted'), false, "Enigma M4 thin rotor contacts");
			});
			QUnit.test("Enigma keeps reflector and rotor settings after a new machine is selected if the same settings are available", function(assert){
				$('.thin-rotor-select').val('γ').trigger('change');
				$('.reflector-select').val('D').trigger('change');
				$('.slow-rotor-select').val('V').trigger('change');
				$('.slow-rotor-ring-setting').val('B').trigger('change');
				$('.slow-rotor-ground-setting').val('C').trigger('change');
				$('.middle-rotor-select').val('IV').trigger('change');
				$('.middle-rotor-ring-setting').val('D').trigger('change');
				$('.middle-rotor-ground-setting').val('E').trigger('change');				
				$('.fast-rotor-select').val('VII').trigger('change');
				$('.fast-rotor-ring-setting').val('F').trigger('change');
				$('.fast-rotor-ground-setting').val('G').trigger('change');				
				$('.enigma-machine-select').val('M3').trigger('change');
				assert.equal($('.reflector-select').val(), 'D', "Reflector is D");
				assert.equal($('.thin-rotor-select').val(), null, "Thin rotor is unavailable");
				assert.equal($('.slow-rotor-select').val(), 'V', "Slow rotor is V");
				assert.equal($('.slow-rotor-ring-setting').val(), 'B', "Slow rotor ring setting is B");
				assert.equal($('.slow-rotor-ground-setting').val(), 'C', "Slow rotor ground setting is C");
				assert.equal($('.middle-rotor-select').val(), 'IV', "Middle rotor is IV");
				assert.equal($('.middle-rotor-ring-setting').val(), 'D', "Middle rotor ring setting is D");
				assert.equal($('.middle-rotor-ground-setting').val(), 'E', "Middle rotor ground setting is E");				
				assert.equal($('.fast-rotor-select').val(), 'VII', "Fast rotor is VII");
				assert.equal($('.fast-rotor-ring-setting').val(), 'F', "Fast rotor ring setting is F");
				assert.equal($('.fast-rotor-ground-setting').val(), 'G', "Fast rotor ground setting is G");				

			});
			QUnit.test("Button for UKW-D rewiring is created", function(assert){
				assert.equal($('.ukw-d-settings').length, 1, "UKW-D rewiring button is created");
				assert.notOk($('.ukw-d-settings').is(':visible'), "UKW-D rewiring button is hidden by default");
				assert.notOk($('.ukw-d-settings').parent().parent().hasClass('input-group'), "UKW-D rewiring input group is suppressed by default");
			});
			QUnit.test("UKW-D rewiring inputs ", function(assert){
				$('.enigma-machine-select').val('M3').trigger('change');
				$('.reflector-select').val('D').trigger('change');
				assert.ok($('.ukw-d-setting-Y').attr('disabled'), "UKW-D is hardwired at JY");
				assert.ok($('.ukw-d-setting-J').attr('disabled'), "UKW-D is hardwired at JY");				
				assert.equal($('.ukw-d-setting-J').val(), 'Y', "UKW-D is hardwired at JY");
				assert.equal($('.ukw-d-setting-Y').val(), 'J', "UKW-D is hardwired at JY");
				assert.equal($('.ukw-d-setting-A').val(), 'Z', "UKW-D A is Z");
				assert.equal($('.ukw-d-setting-Z').val(), 'A', "UKW-D Z is A");
				$('.ukw-d-setting-A').val('C').trigger('change');
				$('.ukw-d-setting-Z').val('U').trigger('change');
				assert.equal($('.ukw-d-setting-A').val(), 'C', "UKW-D A is C");
				assert.equal($('.ukw-d-setting-Z').val(), 'U', "UKW-D Z is U");
				$('.reflector-select').val('C').trigger('change');
				$('.reflector-select').val('D').trigger('change');
				assert.equal($('.ukw-d-setting-A').val(), 'C', "UKW-D A is C");
				assert.equal($('.ukw-d-setting-Z').val(), 'U', "UKW-D Z is U");				
			});
			QUnit.test("It disables the thin rotor on the M4 when reflector D is selected", function(assert){
				$('.reflector-select').val('D').trigger('change');
				assert.equal($('.thin-rotor-select').attr('disabled'), 'disabled', "Enigma M4 has disabled thin rotor");				
				assert.equal($('.thin-rotor-ring-setting').attr('disabled'), 'disabled', "Enigma M4 has disabled thin rotor");				
				assert.equal($('.thin-rotor-ground-setting').attr('disabled'), 'disabled', "Enigma M4 has disabled thin rotor");
				var done = assert.async();
				setTimeout(function(){
					assert.equal($('.thin-rotor .wire').length, 0, "Enigma M4 thin rotor wires removed");
					assert.equal($('.thin-rotor .contacts').parent().hasClass('text-muted'), true, "Enigma M4 thin rotor contacts");
					$('.reflector-select').val('C Thin').trigger('change');
					assert.equal($('.thin-rotor-select').attr('disabled'), undefined, "Enigma M4 has disabled thin rotor");				
					assert.equal($('.thin-rotor-ring-setting').attr('disabled'), undefined, "Enigma M4 has disabled thin rotor");				
					assert.equal($('.thin-rotor-ground-setting').attr('disabled'), undefined, "Enigma M4 has disabled thin rotor");
					var done2 = assert.async();
					setTimeout(function(){
						assert.equal($('.thin-rotor .wire').length, 78, "Enigma M4 thin rotor wires");
						done2();
					}, 0);
					assert.equal($('.thin-rotor .contacts').parent().hasClass('text-muted'), false, "Enigma M4 thin rotor contacts");					
					done();
				}, 0);
			});				
			QUnit.test("It changes the reflector ground setting back to the default when a machine with no reflector ground position is selected", function(assert){
				$('.enigma-machine-select').val('G').trigger('change');
				$('.reflector-ground-setting').val('D').trigger('change');
				$('.enigma-machine-select').val('G-312').trigger('change');
				assert.equal($('.reflector-ground-setting').val(), 'D', "Reflector ground setting is D");
				$('.enigma-machine-select').val('I').trigger('change');
				assert.equal($('.reflector-ground-setting').val(), 'A', "Reflector ground setting is A")
			});
			
			QUnit.module('Startup');
			QUnit.test("It initializes an Enigma Machine from interface settings", function(assert){
				assert.deepEqual(gui.enigma, new EnigmaMachine('M4', ['β', 'I', 'II', 'III'], 'B Thin'), "M4 with rotors β, I, II, III and reflector B Thin created by default");
				assert.notOk(Uhr.prototype.isPrototypeOf(gui.enigma.plugboard), "It is not using the uhr");
			});			
			
			QUnit.module('Visualization');
			QUnit.test("Wire path targets are created", function(assert){
				assert.equal($('.thin-rotor .wire-path-targets div').length, 26, "Thin rotor wire path targets");
				assert.equal($('.slow-rotor .wire-path-targets div').length, 26, "Slow rotor wire path targets");
				assert.equal($('.middle-rotor .wire-path-targets div').length, 26, "Middle rotor wire path targets");
				assert.equal($('.fast-rotor .wire-path-targets div').length, 26, "Fast rotor wire path targets");
			});
			QUnit.test("Contacts are created", function(assert){
				assert.equal($('.reflector .contacts div div').length, 26, "Reflector contacts");
				assert.equal($('.thin-rotor .contacts div div').length, 52, "Thin rotor contacts");
				assert.equal($('.slow-rotor .contacts div div').length, 52, "Slow rotor contacts");
				assert.equal($('.middle-rotor .contacts div div').length, 52, "Middle rotor contacts");
				assert.equal($('.fast-rotor .contacts div div').length, 52, "Fast rotor contacts");
				assert.equal($('.plugboard .contacts div div').length, 26, "Plugboard contacts");
				assert.equal($('.entry-wheel .contacts div div').length, 26, "Entry wheel contacts");
			});
			QUnit.test("Wire paths are created", function(assert){
				var done = assert.async();
				setTimeout(function(){
					assert.equal($('.reflector-wire').length, 39, "Reflector wires");
					assert.equal($('.thin-rotor-wire').length, 78, "Thin rotor wires");
					assert.equal($('.slow-rotor-wire').length, 78, "Slow rotor wires");
					assert.equal($('.middle-rotor-wire').length, 78, "Middle rotor wires");
					assert.equal($('.fast-rotor-wire').length, 78, "Fast rotor wires");
					assert.equal($('.plugboard-wire').length, 78, "Plugboard wires");
					done();
				}, 250);
			});
			QUnit.test("Rotor wires update after adjusting rotor-select interface elements", function(assert){			
				$('.wire').remove();
				$('.thin-rotor-select option').val('γ').trigger('change');
				$('.slow-rotor-select option').val('II').trigger('change');
				$('.middle-rotor-select option').val('III').trigger('change');
				$('.fast-rotor-select option').val('IV').trigger('change');
				assert.equal($('.thin-rotor-wire').length, 78, "Thin rotor has 78 wire segments");			
				assert.equal($('.slow-rotor-wire').length, 78, "Slow rotor has 78 wire segments");			
				assert.equal($('.middle-rotor-wire').length, 78, "Middle rotor has 78 wire segments");			
				assert.equal($('.fast-rotor-wire').length, 78, "Fast rotor has 78 wire segments");			
			});			
			QUnit.test("Plugboard wires update after adjusting enigma-machine-plugboard-uhr interface element", function(assert){			
				$('.wire').remove();
				$('.enigma-machine-plugboard-uhr').val('1').trigger('change');		
				assert.equal($('.plugboard-wire').length, 78, "Plugboard 78 wire segments");			
			});
			QUnit.test("Plugboard wires update after adjusting plugboard-uhr-setting interface element", function(assert){			
				$('.enigma-machine-plugboard-uhr').val('1').trigger('change');
				$('.wire').remove();
				$('.plugboard-uhr-setting').val(2).trigger('change');		
				assert.equal($('.plugboard-wire').length, 78, "Plugboard 78 wire segments");			
			});
			QUnit.test("Plugboard wires update after adjusting plugboard-settings interface element", function(assert){			
				$('.wire').remove();	
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 66, keyCode: 66});
				assert.equal($('.plugboard-wire').length, 78, "Plugboard 78 wire segments");
				$('.enigma-machine-plugboard-uhr').val('1').trigger('change');
				$('.plugboard-uhr-setting').val(2).trigger('change');
				$('.wire').remove();
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 66, keyCode: 66});				
				$('.plugboard-setting-A').trigger({type: 'keydown', which: '0'.charCodeAt(), keyCode: '0'.charCodeAt()});
				$('.plugboard-setting-B').trigger({type: 'keydown', which: 65, keyCode: 65});				
				$('.plugboard-setting-B').trigger({type: 'keydown', which: '0'.charCodeAt(), keyCode: '0'.charCodeAt()});
				
				assert.equal($('.plugboard-wire').length, 78, "Plugboard 78 wire segments");				
			});		
			QUnit.test("Reflector wires update after adjusting reflector-select interface element", function(assert){
				$('.reflector-wire').remove();
				$('.reflector-select').val('C Thin').trigger('change');
				assert.equal($('.reflector-wire').length, 39, "Reflector has 39 wire segments");			
			});	
			QUnit.test("Reflector wires update after adjusting ukw-d-settings interface element", function(assert){			
				$('.enigma-machine-select').val('M3').trigger('change');
				$('.reflector-select').val('D').trigger('change');			
				$('.wire').remove();	
				$('.ukw-d-setting-A').trigger({type: 'keydown', which: 66, keyCode: 66});
				assert.equal($('.reflector-wire').length, 42, "Reflector 42 wire segments");				
			});			
			QUnit.test("Rotor contact positions and wires update after stepping", function(assert){	
				$('.enigma-machine-select').val('Zählwerk');
				$('.enigma-machine-select').trigger('change');
				$('.wire').remove();
				$('.enigma-io').trigger({type: 'keydown', which: 65, keyCode: 65});
				assert.equal($($('.reflector .alphabet-left div')[0]).text(), 'C', "Reflector rotor");
				assert.equal($($('.slow-rotor .alphabet-pair-left .alphabet-left div')[0]).text(), 'C', "Slow rotor");
				assert.equal($($('.middle-rotor .alphabet-pair-left .alphabet-left div')[0]).text(), 'C', "Middle rotor");
				assert.equal($($('.fast-rotor .alphabet-pair-left .alphabet-left div')[0]).text(), 'C', "Fast rotor");
				assert.equal($('.reflector-wire').length, 39, "Reflector wires");
				assert.equal($('.slow-rotor-wire').length, 78, "Slow rotor wires");
				assert.equal($('.middle-rotor-wire').length, 78, "Middle rotor wires");
				assert.equal($('.fast-rotor-wire').length, 78, "Fast rotor wires");				
			});
			QUnit.test("Rotor contact positions and wires update after adjusting ground-setting interface element", function(assert){
				$('.enigma-machine-select').val('Zählwerk');
				$('.enigma-machine-select').trigger('change');
				$('.wire').remove();
				$('.reflector-ground-setting').val('B').trigger('change');
				$('.slow-rotor-ground-setting').val('B').trigger('change');
				$('.middle-rotor-ground-setting').val('B').trigger('change');
				$('.fast-rotor-ground-setting').val('B').trigger('change');
				assert.equal($($('.reflector .alphabet-left div')[0]).text(), 'C', "Reflector rotor");
				assert.equal($($('.slow-rotor .alphabet-pair-left .alphabet-left div')[0]).text(), 'C', "Slow rotor");
				assert.equal($($('.middle-rotor .alphabet-pair-left .alphabet-left div')[0]).text(), 'C', "Middle rotor");
				assert.equal($($('.fast-rotor .alphabet-pair-left .alphabet-left div')[0]).text(), 'C', "Fast rotor");
				assert.equal($('.reflector-wire').length, 39, "Reflector wires");
				assert.equal($('.slow-rotor-wire').length, 78, "Slow rotor wires");
				assert.equal($('.middle-rotor-wire').length, 78, "Middle rotor wires");
				assert.equal($('.fast-rotor-wire').length, 78, "Fast rotor wires");				
			});	
			QUnit.test("Wires are lit to show circuit path when enigma ciphers a letter", function(assert){
				$('.enigma-io').trigger({type: 'keydown', which: 65, keyCode: 65});
				assert.equal($('.plugboard-wire-A.hot-in').length, 3, "Plugboard has three lit wire segments on the inbound circuit path");
				assert.equal($('.plugboard-wire-B.hot-out').length, 3, "Plugboard has three lit wire segments on the outbound circuit path");
				assert.equal($('.fast-rotor-wire-B.hot-in').length, 3, "Fast rotor has three lit wire segments on the inbound circuit path");
				assert.equal($('.fast-rotor-wire-C.hot-out').length, 3, "Fast rotor has three lit wire segments on the outbound circuit path");
				assert.equal($('.middle-rotor-wire-C.hot-in').length, 3, "Middle rotor has three lit wire segments on the inbound circuit path");
				assert.equal($('.middle-rotor-wire-E.hot-out').length, 3, "Middle rotor has three lit wire segments on the outbound circuit path");
				assert.equal($('.slow-rotor-wire-D.hot-in').length, 3, "Slow rotor has three lit wire segments on the inbound circuit path");
				assert.equal($('.slow-rotor-wire-S.hot-out').length, 3, "Slow rotor has three lit wire segments on the outbound circuit path");
				assert.equal($('.thin-rotor-wire-F.hot-in').length, 3, "Thin rotor has three lit wire segments on the inbound circuit path");
				assert.equal($('.thin-rotor-wire-S.hot-out').length, 3, "Thin rotor has three lit wire segments on the outbound circuit path");
				assert.equal($('.reflector-wire-in-C.hot-in').length, 1, "Reflector has one lit wire segment on the inbound circuit path");
				assert.equal($('.reflector-wire-middle-C.hot-in-out').length | $('.reflector-wire.hot-out-in').length, 1, "Reflector has one lit wire segment on the transitional path");
				assert.equal($('.reflector-wire-out-C.hot-out').length, 1, "Reflector has one lit wire segment on the outbound circuit path");
			});
			QUnit.test("Wires are lit to show circuit path when enigma with plugboard AB ciphers a letter", function(assert){
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 66, keyCode: 66});
				$('.enigma-io').trigger({type: 'keydown', which: 65, keyCode: 65});
				assert.equal($('.plugboard-wire-A.hot-in').length, 3, "Plugboard has three lit wire segments on the inbound circuit path");
				assert.equal($('.plugboard-wire-B.hot-out').length, 3, "Plugboard has three lit wire segments on the outbound circuit path");
			});			
			QUnit.test("Wires are lit to show circuit path when enigma with ring settings ciphers a letter", function(assert){
				$('.fast-rotor-ring-setting').val('E').trigger('change');
				$('.middle-rotor-ring-setting').val('D').trigger('change');
				$('.slow-rotor-ring-setting').val('C').trigger('change');
				$('.thin-rotor-ring-setting').val('B').trigger('change');
				$('.enigma-io').trigger({type: 'keydown', which: 65, keyCode: 65});
				assert.equal($('.plugboard-wire-A.hot-in').length, 3, "Plugboard has three lit wire segments on the inbound circuit path");
				assert.equal($('.plugboard-wire-O.hot-out').length, 3, "Plugboard has three lit wire segments on the outbound circuit path");
				assert.equal($('.fast-rotor-wire-B.hot-in').length, 3, "Fast rotor has three lit wire segments on the inbound circuit path");
				assert.equal($('.fast-rotor-wire-P.hot-out').length, 3, "Fast rotor has three lit wire segments on the outbound circuit path");
				assert.equal($('.middle-rotor-wire-V.hot-in').length, 3, "Middle rotor has three lit wire segments on the inbound circuit path");
				assert.equal($('.middle-rotor-wire-Y.hot-out').length, 3, "Middle rotor has three lit wire segments on the outbound circuit path");
				assert.equal($('.slow-rotor-wire-C.hot-in').length, 3, "Slow rotor has three lit wire segments on the inbound circuit path");
				assert.equal($('.slow-rotor-wire-B.hot-out').length, 3, "Slow rotor has three lit wire segments on the outbound circuit path");	
				assert.equal($('.thin-rotor-wire-G.hot-in').length, 3, "Thin rotor has three lit wire segments on the inbound circuit path");
				assert.equal($('.thin-rotor-wire-L.hot-out').length, 3, "Thin rotor has three lit wire segments on the outbound circuit path");
				assert.equal($('.reflector-wire-in-D.hot-in').length, 1, "Reflector has one lit wire segment on the inbound circuit path");
				assert.equal($('.reflector-wire-middle-D.hot-in-out').length | $('.reflector-wire.hot-out-in').length, 1, "Reflector has one lit wire segment on the transitional path");
				assert.equal($('.reflector-wire-out-D.hot-out').length, 1, "Reflector has one lit wire segment on the outbound circuit path");
			});
			QUnit.test("Contacts are lit to show circuit path when enigma ciphers a letter", function(assert){
				$('.enigma-io').trigger({type: 'keydown', which: 65, keyCode: 65}); 
				assert.equal($('.entry-wheel .contacts .alphabet-A.hot-in').length, 1, "Entry wheel has one lit contact on the inbound circuit path");
				assert.equal($('.entry-wheel .contacts .alphabet-B.hot-out').length, 1, "Entry wheel has one lit contact on the outbound circuit path");
				assert.equal($('.plugboard .contacts .alphabet-A.hot-in').length, 1, "Plugboard has one lit contact on the inbound circuit path");
				assert.equal($('.plugboard .contacts .alphabet-B.hot-out').length, 1, "Plugboard has one lit contact on the outbound circuit path");
				assert.equal($('.fast-rotor .contacts .hot-in').length, 2, "Fast rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.fast-rotor .alphabet-pair-right .alphabet-B.hot-in').length, 1, "Fast rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.fast-rotor .alphabet-pair-left .alphabet-D.hot-in').length, 1, "Fast rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.fast-rotor .contacts .hot-out').length, 2, "Fast rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.fast-rotor .alphabet-pair-left .alphabet-F.hot-out').length, 1, "Fast rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.fast-rotor .alphabet-pair-right .alphabet-C.hot-out').length, 1, "Fast rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.middle-rotor .contacts .hot-in').length, 2, "Middle rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.middle-rotor .alphabet-pair-right .alphabet-C.hot-in').length, 1, "Middle rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.middle-rotor .alphabet-pair-left .alphabet-D.hot-in').length, 1, "Middle rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.middle-rotor .contacts .hot-out').length, 2, "Middle rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.middle-rotor .alphabet-pair-left .alphabet-S.hot-out').length, 1, "Middle rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.middle-rotor .alphabet-pair-right .alphabet-E.hot-out').length, 1, "Middle rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.slow-rotor .contacts .hot-in').length, 2, "Slow rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.slow-rotor .alphabet-pair-right .alphabet-D.hot-in').length, 1, "Slow rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.slow-rotor .alphabet-pair-left .alphabet-F.hot-in').length, 1, "Slow rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.slow-rotor .contacts .hot-out').length, 2, "Slow rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.slow-rotor .alphabet-pair-left .alphabet-S.hot-out').length, 1, "Slow rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.slow-rotor .alphabet-pair-right .alphabet-S.hot-out').length, 1, "Slow rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.thin-rotor .contacts .hot-in').length, 2, "Thin rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.thin-rotor .alphabet-pair-right .alphabet-F.hot-in').length, 1, "Thin rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.thin-rotor .alphabet-pair-left .alphabet-C.hot-in').length, 1, "Thin rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.thin-rotor .contacts .hot-out').length, 2, "Thin rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.thin-rotor .alphabet-pair-left .alphabet-K.hot-out').length, 1, "Thin rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.thin-rotor .alphabet-pair-right .alphabet-S.hot-out').length, 1, "Thin rotor has two lit contacts on the outbound circuit path");				
				assert.equal($('.reflector .contacts .alphabet-C.hot-in').length, 1, "Reflector has one lit contact on the inbound circuit path");				
				assert.equal($('.reflector .contacts .alphabet-K.hot-out').length, 1, "Reflector has one lit contact on the outbound circuit path");				
			});
			QUnit.test("Contacts are lit to show circuit path when enigma with plugboard AB ciphers a letter", function(assert){
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 66, keyCode: 66});
				$('.enigma-io').trigger({type: 'keydown', which: 65, keyCode: 65}); 
				assert.equal($('.entry-wheel .contacts .alphabet-A.hot-in').length, 1, "Entry wheel has one lit contact on the inbound circuit path");
				assert.equal($('.entry-wheel .contacts .alphabet-B.hot-out').length, 1, "Entry wheel has one lit contact on the outbound circuit path");
				assert.equal($('.plugboard .contacts .alphabet-B.hot-in').length, 1, "Plugboard has one lit contact on the inbound circuit path");
				assert.equal($('.plugboard .contacts .alphabet-A.hot-out').length, 1, "Plugboard has one lit contact on the outbound circuit path");			
			});			
			QUnit.test("Contacts are lit to show circuit path when enigma with ring setting ciphers a letter", function(assert){
				$('.fast-rotor-ring-setting').val('E').trigger('change');
				$('.middle-rotor-ring-setting').val('D').trigger('change');
				$('.slow-rotor-ring-setting').val('C').trigger('change');
				$('.thin-rotor-ring-setting').val('B').trigger('change');
				$('.enigma-io').trigger({type: 'keydown', which: 65, keyCode: 65}); 
				assert.equal($('.entry-wheel .contacts .alphabet-A.hot-in').length, 1, "Entry wheel has one lit contact on the inbound circuit path");
				assert.equal($('.entry-wheel .contacts .alphabet-O.hot-out').length, 1, "Entry wheel has one lit contact on the outbound circuit path");
				assert.equal($('.plugboard .contacts .alphabet-A.hot-in').length, 1, "Plugboard has one lit contact on the inbound circuit path");
				assert.equal($('.plugboard .contacts .alphabet-O.hot-out').length, 1, "Plugboard has one lit contact on the outbound circuit path");
				assert.equal($('.fast-rotor .contacts .hot-in').length, 2, "Fast rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.fast-rotor .alphabet-pair-right .alphabet-B.hot-in').length, 1, "Fast rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.fast-rotor .alphabet-pair-left .alphabet-W.hot-in').length, 1, "Fast rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.fast-rotor .contacts .hot-out').length, 2, "Fast rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.fast-rotor .alphabet-pair-left .alphabet-Z.hot-out').length, 1, "Fast rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.fast-rotor .alphabet-pair-right .alphabet-P.hot-out').length, 1, "Fast rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.middle-rotor .contacts .hot-in').length, 2, "Middle rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.middle-rotor .alphabet-pair-right .alphabet-V.hot-in').length, 1, "Middle rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.middle-rotor .alphabet-pair-left .alphabet-C.hot-in').length, 1, "Middle rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.middle-rotor .contacts .hot-out').length, 2, "Middle rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.middle-rotor .alphabet-pair-left .alphabet-B.hot-out').length, 1, "Middle rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.middle-rotor .alphabet-pair-right .alphabet-Y.hot-out').length, 1, "Middle rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.slow-rotor .contacts .hot-in').length, 2, "Slow rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.slow-rotor .alphabet-pair-right .alphabet-C.hot-in').length, 1, "Slow rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.slow-rotor .alphabet-pair-left .alphabet-G.hot-in').length, 1, "Slow rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.slow-rotor .contacts .hot-out').length, 2, "Slow rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.slow-rotor .alphabet-pair-left .alphabet-L.hot-out').length, 1, "Slow rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.slow-rotor .alphabet-pair-right .alphabet-B.hot-out').length, 1, "Slow rotor has two lit contacts on the outbound circuit path");				
				assert.equal($('.thin-rotor .contacts .hot-in').length, 2, "Thin rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.thin-rotor .alphabet-pair-right .alphabet-G.hot-in').length, 1, "Thin rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.thin-rotor .alphabet-pair-left .alphabet-D.hot-in').length, 1, "Thin rotor has two lit contacts on the inbound circuit path");
				assert.equal($('.thin-rotor .contacts .hot-out').length, 2, "Thin rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.thin-rotor .alphabet-pair-left .alphabet-Q.hot-out').length, 1, "Thin rotor has two lit contacts on the outbound circuit path");
				assert.equal($('.thin-rotor .alphabet-pair-right .alphabet-L.hot-out').length, 1, "Thin rotor has two lit contacts on the outbound circuit path");					
				assert.equal($('.reflector .contacts .alphabet-D.hot-in').length, 1, "Reflector has one lit contact on the inbound circuit path");				
				assert.equal($('.reflector .contacts .alphabet-Q.hot-out').length, 1, "Reflector has one lit contact on the outbound circuit path");				
			});	
			QUnit.test("Wire path targets are lit to show circuit path when enigma ciphers a letter", function(assert){
				$('.enigma-io').trigger({type: 'keydown', which: 65, keyCode: 65}); 
				assert.equal($('.fast-rotor .wire-path-targets .alphabet-C.hot-in').length, 1, "Fast rotor has one lit wire path target on the inbound circuit path");
				assert.equal($('.fast-rotor .wire-path-targets .alphabet-E.hot-out').length, 1, "Fast rotor has one lit wire path target on the outbound circuit path");
				assert.equal($('.middle-rotor .wire-path-targets .alphabet-D.hot-in').length, 1, "Middle rotor one two lit wire path target on the inbound circuit path");
				assert.equal($('.middle-rotor .wire-path-targets .alphabet-S.hot-out').length, 1, "Middle rotor one two lit wire path target on the outbound circuit path");
				assert.equal($('.slow-rotor .wire-path-targets .alphabet-F.hot-in').length, 1, "Slow rotor has one lit wire path target on the inbound circuit path");
				assert.equal($('.slow-rotor .wire-path-targets .alphabet-S.hot-out').length, 1, "Slow rotor has one lit wire path target on the outbound circuit path");
				assert.equal($('.thin-rotor .wire-path-targets .alphabet-C.hot-in').length, 1, "Thin rotor has one lit wire path target on the inbound circuit path");
				assert.equal($('.thin-rotor .wire-path-targets .alphabet-K.hot-out').length, 1, "Thin rotor has one lit wire path target on the outbound circuit path");
			});
			QUnit.test("Wire path targets are lit to show circuit path when enigma with ring setting ciphers a letter", function(assert){
				$('.fast-rotor-ring-setting').val('E').trigger('change');
				$('.middle-rotor-ring-setting').val('D').trigger('change');
				$('.slow-rotor-ring-setting').val('C').trigger('change');
				$('.thin-rotor-ring-setting').val('B').trigger('change');				
				$('.enigma-io').trigger({type: 'keydown', which: 65, keyCode: 65}); 
				assert.equal($('.fast-rotor .wire-path-targets .alphabet-V.hot-in').length, 1, "Fast rotor has one lit wire path target on the inbound circuit path");
				assert.equal($('.fast-rotor .wire-path-targets .alphabet-Y.hot-out').length, 1, "Fast rotor has one lit wire path target on the outbound circuit path");
				assert.equal($('.middle-rotor .wire-path-targets .alphabet-C.hot-in').length, 1, "Middle rotor one two lit wire path target on the inbound circuit path");
				assert.equal($('.middle-rotor .wire-path-targets .alphabet-B.hot-out').length, 1, "Middle rotor one two lit wire path target on the outbound circuit path");
				assert.equal($('.slow-rotor .wire-path-targets .alphabet-G.hot-in').length, 1, "Slow rotor has one lit wire path target on the inbound circuit path");
				assert.equal($('.slow-rotor .wire-path-targets .alphabet-L.hot-out').length, 1, "Slow rotor has one lit wire path target on the outbound circuit path");
				assert.equal($('.thin-rotor .wire-path-targets .alphabet-D.hot-in').length, 1, "Thin rotor has one lit wire path target on the inbound circuit path");
				assert.equal($('.thin-rotor .wire-path-targets .alphabet-Q.hot-out').length, 1, "Thin rotor has one lit wire path target on the outbound circuit path");
			});			
			QUnit.test("Visualizations are reset when enigma-machine-select changes", function(assert){
				$('.enigma-io').trigger({type: 'keydown', which: 65, keyCode: 65}); 
				$('.enigma-machine-select').val('G');
				$('.enigma-machine-select').trigger('change');
				assert.equal($('.hot-in').length, 0, "There are no elements active on the input circuit path");
				assert.equal($('.hot-out').length, 0, "There are no elements active on the output path");
				assert.equal($('.hot-in-out').length + $('.hot-out-in').length, 0, "There are no elements active on the transitional circuit path");
				assert.equal($('.enigma-io').val(), '', "Enigma I/O is empty");
			});			
			QUnit.test("Entry wheel visual changes when enigma-machine-select changes", function(assert){
				$('.enigma-machine-select').val('D');
				$('.enigma-machine-select').trigger('change');
				assert.equal($($('.entry-wheel .contacts div div')[0]).text(), 'Q', "Enigma D entry wheel");
			});			
			
			QUnit.module("Operation");
			QUnit.test("Enigma I/O", function(assert){
				$('.enigma-io').trigger({type: 'keydown', which: 65, keyCode: 65});
				assert.equal($('.enigma-io').val(), 'A -> B  ', "Entering A to the i/o input changes the i/o display to 'A -> B  '");
			});
			QUnit.test("Enigma machine version is changed and intitialized when enigma-machine-select changes", function(assert){
				$('.enigma-machine-select').val('M3');
				$('.enigma-machine-select').trigger('change');
				assert.equal(gui.enigma.machine_version, 'M3', "Enigma core");
			});
			QUnit.test("Entry wheel is changed when enigma-machine-select changes", function(assert){
				$('.enigma-machine-select').val('D');
				$('.enigma-machine-select').trigger('change');
				assert.deepEqual(gui.enigma.entry_wheel.wire_map, 'QWERTZUIOASDFGHJKPYXCVBNML'.split(''), "Enigma D entry wheel");
			});			
			QUnit.test("Rotor and reflector deflection adjusted by ground-setting interface element", function(assert){
				$('.fast-rotor-ground-setting').val('E').trigger('change');
				$('.middle-rotor-ground-setting').val('D').trigger('change');
				$('.slow-rotor-ground-setting').val('C').trigger('change');
				$('.thin-rotor-ground-setting').val('B').trigger('change');
				assert.equal(gui.enigma.rotors[3].deflection, 4, "Fast Rotor");
				assert.equal(gui.enigma.rotors[2].deflection, 3, "Middle Rotor");
				assert.equal(gui.enigma.rotors[1].deflection, 2, "Slow Rotor");
				assert.equal(gui.enigma.rotors[0].deflection, 1, "Thin Rotor");
				$('.enigma-machine-select').val('Zählwerk');
				$('.enigma-machine-select').trigger('change');	
				$('.reflector-ground-setting').val('B').trigger('change');
				assert.equal(gui.enigma.reflector_wheel.deflection, 1, "Reflector");				
			});
			QUnit.test("Rotor and reflector ground setting update after stepping", function(assert){
				$('.enigma-io').trigger({type: 'keydown', which: 65, keyCode: 65});
				assert.equal($('.fast-rotor-ground-setting').val(), 'B', "Fast rotor");
				assert.equal($('.middle-rotor-ground-setting').val(), 'A', "Middle rotor");
				assert.equal($('.slow-rotor-ground-setting').val(), 'A', "Slow rotor");
				assert.equal($('.thin-rotor-ground-setting').val(), 'A', "Thin rotor");
				$('.enigma-machine-select').val('Zählwerk');
				$('.enigma-machine-select').trigger('change');
				$('.fast-rotor-ground-setting').val('A').trigger('change');
				$('.enigma-io').trigger({type: 'keydown', which: 65, keyCode: 65});
				assert.equal($('.fast-rotor-ground-setting').val(), 'B', "Fast rotor");	
				assert.equal($('.middle-rotor-ground-setting').val(), 'B', "Middle rotor");
				assert.equal($('.slow-rotor-ground-setting').val(), 'B', "Slow rotor");				
				assert.equal($('.reflector-ground-setting').val(), 'B', "Reflector");				
			});
			QUnit.test("Rotor ring setting adjusted by ring-setting interface element", function(assert){
				$('.fast-rotor-ring-setting').val('E').trigger('change');
				$('.middle-rotor-ring-setting').val('D').trigger('change');
				$('.slow-rotor-ring-setting').val('C').trigger('change');
				$('.thin-rotor-ring-setting').val('B').trigger('change');
				assert.equal(gui.enigma.rotors[3].ring_setting, 4, "Fast Rotor");
				assert.equal(gui.enigma.rotors[2].ring_setting, 3, "Middle Rotor");
				assert.equal(gui.enigma.rotors[1].ring_setting, 2, "Slow Rotor");
				assert.equal(gui.enigma.rotors[0].ring_setting, 1, "Thin Rotor");				
			});
			QUnit.test("Plugboard adjusted by plugboard-settings-field interface inputs", function(assert){
				assert.equal(gui.enigma.plugboard.translate('A'), 'A', "Plugboard A translates to A by default");
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 66, keyCode: 66});
				assert.equal(gui.enigma.plugboard.translate('A'), 'B', "Plugboard A translates to B with plugboard-setting-A set to B");				
			});	
			QUnit.test("Plugboard settings cannot be set to themselves", function(assert){
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 65, keyCode: 65});
				assert.deepEqual(gui.enigma.plugboard.pairs, {}, "Plugboard remains empty");				
			});
			QUnit.test("Plugboard settings are A-Z only by default", function(assert){
				$('.plugboard-setting-A').trigger({type: 'keydown', which: '5'.charCodeAt(), keyCode: '5'.charCodeAt()});
				assert.deepEqual(gui.enigma.plugboard.pairs, {}, "Plugboard remains empty");				
			});
			QUnit.test("Plugboard settings are of the form (a|b)[0-9]{1} with uhr enabled", function(assert){
				$('.enigma-machine-plugboard-uhr').val('1').trigger('change');
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 67, keyCode: 67});
				assert.deepEqual(gui.enigma.plugboard.pairs, {}, "Plugboard remains empty");

				$('.plugboard-setting-Z').trigger({type: 'keydown', which: '1'.charCodeAt(), keyCode: '1'.charCodeAt()});
				assert.equal($('.plugboard-setting-Z').val(), '', "Plugboard settings must start with 'A' or 'B'");				

				$('.plugboard-setting-A').trigger({type: 'keydown', which: 65, keyCode: 65});
				$('.plugboard-setting-A').trigger({type: 'keydown', which: '0'.charCodeAt(), keyCode: '0'.charCodeAt()});	
				$('.plugboard-setting-B').trigger({type: 'keydown', which: 66, keyCode: 66});
				$('.plugboard-setting-B').trigger({type: 'keydown', which: '0'.charCodeAt(), keyCode: '0'.charCodeAt()});
				assert.deepEqual(gui.enigma.plugboard.translate('A'), 'B', "Plugboard with uhr 0, A a0 and B b0");				
			});	
			QUnit.test("Partial settings with uhr enabled are prevented", function(assert){
				$('.enigma-machine-plugboard-uhr').val('1').trigger('change');
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 65, keyCode: 65});
				$('.plugboard-setting-A').blur();
				assert.equal($('.plugboard-setting-A').val(), '', "Plugboard A is empty");
			});
			QUnit.test("Plugboard settings are specified in pairs", function(assert){
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 67, keyCode: 67});
				assert.equal($('.plugboard-setting-C').val(), 'A', "Plugboard setting C becomes A when plugboard setting A is set to C");				
			});
			QUnit.test("Plugboard settings can be cleared by pressing backspace", function(assert){
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 67, keyCode: 67});
				assert.equal($('.plugboard-setting-A').val(), 'C', "Plugboard A is set to C");
				assert.equal($('.plugboard-setting-C').val(), 'A', "Plugboard C is set to A");
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 8, keyCode: 8});
				assert.equal($('.plugboard-setting-A').val(), '', "Plugboard A is empty after pressing backspace");
				assert.equal($('.plugboard-setting-C').val(), '', "Plugboard C is empty after pressing backspace on paired plug");
				assert.equal(gui.enigma.plugboard.translate('A'), 'A', "Enigma plugboard A is empty after pressing backspace");
				assert.equal(gui.enigma.plugboard.translate('C'), 'C', "Enigma plugboard C is empty after pressing backspace on paired plug");
				$('.enigma-machine-plugboard-uhr').val('1').trigger('change');
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 65, keyCode: 65});
				$('.plugboard-setting-A').trigger({type: 'keydown', which: '0'.charCodeAt(), keyCode: '0'.charCodeAt()});
				$('.plugboard-setting-B').trigger({type: 'keydown', which: 66, keyCode: 66});
				$('.plugboard-setting-B').trigger({type: 'keydown', which: '0'.charCodeAt(), keyCode: '0'.charCodeAt()});
				assert.equal($('.plugboard-setting-A').val(), 'A0', "Uhr Plugboard A is set to A0");
				assert.equal($('.plugboard-setting-B').val(), 'B0', "Uhr Plugboard B is set to B0");
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 8, keyCode: 8});
				assert.equal($('.plugboard-setting-A').val(), '', "Uhr Plugboard A is empty after pressing backspace");
				assert.equal($('.plugboard-setting-B').val(), 'B0', "Uhr Plugboard B is unaffected after pressing backspace on paired plug");
				assert.equal(gui.enigma.plugboard.translate('A'), 'A', "Enigma plugboard A is empty after pressing backspace");
				assert.equal(gui.enigma.plugboard.translate('B'), 'B', "Enigma plugboard B is unaffected after pressing backspace on paired plug");				
			});
			QUnit.test("Plugboard settings can be cleared by pressing delete", function(assert){
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 67, keyCode: 67});
				assert.equal($('.plugboard-setting-A').val(), 'C', "Plugboard A is set to C");
				assert.equal($('.plugboard-setting-C').val(), 'A', "Plugboard C is set to A");
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 46, keyCode: 46});
				assert.equal($('.plugboard-setting-A').val(), '', "Plugboard A is empty after pressing delete");
				assert.equal($('.plugboard-setting-C').val(), '', "Plugboard C is empty after pressing delete on paired plug");
				assert.equal(gui.enigma.plugboard.translate('A'), 'A', "Enigma plugboard A is empty after pressing delete");
				assert.equal(gui.enigma.plugboard.translate('C'), 'C', "Enigma plugboard C is empty after pressing delete on paired plug");				
				$('.enigma-machine-plugboard-uhr').val('1').trigger('change');
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 65, keyCode: 65});
				$('.plugboard-setting-A').trigger({type: 'keydown', which: '0'.charCodeAt(), keyCode: '0'.charCodeAt()});
				$('.plugboard-setting-B').trigger({type: 'keydown', which: 66, keyCode: 66});
				$('.plugboard-setting-B').trigger({type: 'keydown', which: '0'.charCodeAt(), keyCode: '0'.charCodeAt()});
				assert.equal($('.plugboard-setting-A').val(), 'A0', "Uhr Plugboard A is set to A0");
				assert.equal($('.plugboard-setting-B').val(), 'B0', "Uhr Plugboard B is set to B0");
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 46, keyCode: 46});
				assert.equal($('.plugboard-setting-A').val(), '', "Uhr Plugboard A is empty after pressing backspace");
				assert.equal($('.plugboard-setting-B').val(), 'B0', "Uhr Plugboard B is unaffected after pressing backspace on paired plug");
				assert.equal(gui.enigma.plugboard.translate('A'), 'A', "Enigma plugboard A is empty after pressing delete");
				assert.equal(gui.enigma.plugboard.translate('B'), 'B', "Enigma plugboard B is unaffected after pressing delete on paired plug");					
			});
			QUnit.test("Plugboard settings are adjusted to prevent duplication", function(assert){
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 66, keyCode: 66});
				$('.plugboard-setting-C').trigger({type: 'keydown', which: 66, keyCode: 66});
				assert.equal($('.plugboard-setting-A').val(), '', "Plugboard setting A becomes empty");
				$('.plugboard-setting-C').trigger({type: 'keydown', which: 68, keyCode: 68});
				$('.plugboard-setting-D').trigger({type: 'keydown', which: 65, keyCode: 65});
				assert.equal($('.plugboard-setting-B').val(), '', "Plugboard setting B becomes empty when D takes its setting");				
				assert.equal($('.plugboard-setting-C').val(), '', "Plugboard setting C becomes empty when its partner is paired with another setting");				
			});	
			QUnit.test("Plugboard settings are adjusted to prevent duplication with uhr enabled", function(assert){
				$('.enigma-machine-plugboard-uhr').val('1').trigger('change');
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 65, keyCode: 65});
				$('.plugboard-setting-A').trigger({type: 'keydown', which: '0'.charCodeAt(), keyCode: '0'.charCodeAt()});	
				$('.plugboard-setting-B').trigger({type: 'keydown', which: 66, keyCode: 66});
				$('.plugboard-setting-B').trigger({type: 'keydown', which: '0'.charCodeAt(), keyCode: '0'.charCodeAt()});
				$('.plugboard-setting-C').trigger({type: 'keydown', which: 65, keyCode: 65});
				$('.plugboard-setting-C').trigger({type: 'keydown', which: '0'.charCodeAt(), keyCode: '0'.charCodeAt()});
				assert.equal($('.plugboard-setting-A').val(), '', "Plugboard setting A is empty");
			});	
			QUnit.test("Plugboard settings are cleared when plugboard uhr is enabled or disabled", function(assert){
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 66, keyCode: 66});
				$('.enigma-machine-plugboard-uhr').val('1').trigger('change');
				assert.equal($('.plugboard-setting-A').val(), '', "Plugboard A is empty");
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 66, keyCode: 66});
				$('.plugboard-setting-A').trigger({type: 'keydown', which: '0'.charCodeAt(), keyCode: '0'.charCodeAt()});
				$('.enigma-machine-plugboard-uhr').val('0').trigger('change');
				assert.equal($('.plugboard-setting-A').val(), '', "Plugboard A is empty");				
			});
			QUnit.test("Enigma machine reflector wheel is changed by reflector-select interface element", function(assert){
				$('.reflector-select').val('C Thin').trigger('change');
				assert.deepEqual(gui.enigma.reflector_wheel.cipher_map, 'RDOBJNTKVEHMLFCWZAXGYIPSUQ'.split(''), "Reflector C");
			});
			QUnit.test("Reflector wheel ground setting is set when a new machine is selected", function(assert){
				$('.enigma-machine-select').val('G').trigger('change');
				$('.reflector-ground-setting').val('D').trigger('change');
				$('.enigma-machine-select').val('G-312').trigger('change');
				assert.equal(gui.enigma.reflector_wheel.deflection, 3, "Reflector ground setting");				
			});
			QUnit.test("Enigma machine rotors are changed by rotor-select interface elements", function(assert){			
				$('.thin-rotor-select').val('γ').trigger('change');
				$('.slow-rotor-select').val('II').trigger('change');
				$('.middle-rotor-select').val('III').trigger('change');
				$('.fast-rotor-select').val('IV').trigger('change');
				assert.deepEqual(gui.enigma.rotors[0].encipher_map, 'FSOKANUERHMBTIYCWLQPZXVGJD'.split(''), "Thin Rotor γ");			
				assert.deepEqual(gui.enigma.rotors[1].encipher_map, 'AJDKSIRUXBLHWTMCQGZNPYFVOE'.split(''), "Rotor II");			
				assert.deepEqual(gui.enigma.rotors[2].encipher_map, 'BDFHJLCPRTXVZNYEIWGAKMUSQO'.split(''), "Rotor III");			
				assert.deepEqual(gui.enigma.rotors[3].encipher_map, 'ESOVPZJAYQUIRHXLNFTGKDCMWB'.split(''), "Rotor IV");			
			});
			QUnit.test("Plugboard uhr settings are available when uhr is enabled", function(assert){
				assert.equal($('.plugboard-uhr-setting').attr('disabled'), 'disabled', "Plugboard setting uhr is disabled by default");
				$('.enigma-machine-plugboard-uhr').val('1').trigger('change');
				assert.equal($('.plugboard-uhr-setting').attr('disabled'), undefined, "Plugboard setting uhr is not disabeld when the enigma machine plugboard uhr setting is yes");
				$('.enigma-machine-plugboard-uhr').val('0').trigger('change');
				assert.equal($('.plugboard-uhr-setting').attr('disabled'), 'disabled', "Plugboard setting uhr is disabeld when the enigma machine plugboard uhr setting is no");
			});
			QUnit.test("Enigma machine uses uhr when enabled by interface elements", function(assert){			
				$('.enigma-machine-plugboard-uhr').val('1').trigger('change');			
				assert.ok(Uhr.prototype.isPrototypeOf(gui.enigma.plugboard), "Using uhr");
			});
			QUnit.test("Enigma machine uhr setting is adjusted by interface elements", function(assert){			
				$('.enigma-machine-plugboard-uhr').val('1').trigger('change');
				$('.plugboard-uhr-setting').val(0).trigger('change');
				assert.equal(gui.enigma.plugboard.setting, 0, "Uhr has setting 0");
			});
			QUnit.test("It shows the UKW-D settings button when UKW-D is selected", function(assert){
				$('.enigma-machine-select').val('M3').trigger('change');
				$('.reflector-select').val('D').trigger('change');
				assert.ok($('.ukw-d-settings').is(':visible'), "UKW-D settings button is visible");
				assert.ok($('.ukw-d-settings').parent().parent().hasClass('input-group'), "UKW-D rewiring input group is not suppressed");								
				$('.reflector-select').val('C').trigger('change');
				assert.notOk($('.ukw-d-settings').is(':visible'), "UKW-D settings button is hidden");
				assert.notOk($('.ukw-d-settings').parent().parent().hasClass('input-group'), "UKW-D rewiring input group is suppressed");
			});
			QUnit.test("UKW-D is adjusted by ukw-d-settings-field interface inputs", function(assert){
				$('.enigma-machine-select').val('M3').trigger('change');
				$('.reflector-select').val('D').trigger('change');				
				assert.equal(gui.enigma.reflector_wheel.cipher('A'.charCodeAt() - 65), 'Z'.charCodeAt() - 65, "UKW-D A translates to Z by default");
				$('.ukw-d-setting-A').trigger({type: 'keydown', which: 66, keyCode: 66});
				assert.equal(gui.enigma.reflector_wheel.cipher('A'.charCodeAt() - 65), 'B'.charCodeAt() - 65, "UKW-D A translates to B with ukw-d-setting-A set to B");				
			});				
			QUnit.test("UKW-D settings cannot be set to themselves", function(assert){
				$('.enigma-machine-select').val('M3').trigger('change');
				$('.reflector-select').val('D').trigger('change');				
				$('.ukw-d-setting-A').trigger({type: 'keydown', which: 65, keyCode: 65});
				assert.equal(gui.enigma.reflector_wheel.cipher_map[0], 'Z', "UKW-D A remains Z");				
			});			
			QUnit.test("UKW-D settings are A-Z only by default", function(assert){
				$('.enigma-machine-select').val('M3').trigger('change');
				$('.reflector-select').val('D').trigger('change');				
				$('.ukw-d-setting-A').trigger({type: 'keydown', which: '5'.charCodeAt(), keyCode: '5'.charCodeAt()});
				assert.equal(gui.enigma.reflector_wheel.cipher_map[0], 'Z', "UKW-D A remains empty");				
			});			
			QUnit.test("UKW-D settings are specified in pairs", function(assert){
				$('.enigma-machine-select').val('M3').trigger('change');
				$('.reflector-select').val('D').trigger('change');				
				$('.ukw-d-setting-A').trigger({type: 'keydown', which: 66, keyCode: 66});
				assert.equal($('.ukw-d-setting-B').val(), 'A', "UKW-D setting B becomes A when UKW-D setting A is set to B");				
			});			
			QUnit.test("UKW-D settings can be cleared by pressing backspace", function(assert){
				$('.enigma-machine-select').val('M3').trigger('change');
				$('.reflector-select').val('D').trigger('change');				
				$('.ukw-d-setting-A').trigger({type: 'keydown', which: 67, keyCode: 67});
				assert.equal($('.ukw-d-setting-A').val(), 'C', "UKW-D A is set to C");
				assert.equal($('.ukw-d-setting-C').val(), 'A', "UKW-D C is set to A");
				$('.ukw-d-setting-A').trigger({type: 'keydown', which: 8, keyCode: 8});
				assert.equal($('.ukw-d-setting-A').val(), '', "UKW-D A is empty after pressing backspace");
				assert.equal($('.ukw-d-setting-C').val(), '', "UKW-D C is empty after pressing backspace on paired plug");
				assert.equal(gui.enigma.reflector_wheel.cipher_map[0], '', "Enigma reflector A is empty after pressing backspace");
				assert.equal(gui.enigma.reflector_wheel.cipher_map[2], '', "Enigma reflector C is empty after pressing backspace on paired plug");			
			});
			QUnit.test("UKW-D settings can be cleared by pressing delete", function(assert){
				$('.enigma-machine-select').val('M3').trigger('change');
				$('.reflector-select').val('D').trigger('change');				
				$('.ukw-d-setting-A').trigger({type: 'keydown', which: 67, keyCode: 67});
				assert.equal($('.ukw-d-setting-A').val(), 'C', "UKW-D A is set to C");
				assert.equal($('.ukw-d-setting-C').val(), 'A', "UKW-D C is set to A");
				$('.ukw-d-setting-A').trigger({type: 'keydown', which: 46, keyCode: 46});
				assert.equal($('.ukw-d-setting-A').val(), '', "UKW-D A is empty after pressing delete");
				assert.equal($('.ukw-d-setting-C').val(), '', "UKW-D C is empty after pressing delete on paired plug");
				assert.equal(gui.enigma.reflector_wheel.cipher_map[0], '', "Enigma reflector A is empty after pressing delete");
				assert.equal(gui.enigma.reflector_wheel.cipher_map[2], '', "Enigma reflector C is empty after pressing delete on paired plug");					
			});			
			QUnit.test("UKW-D settings are adjusted to prevent duplication", function(assert){
				$('.enigma-machine-select').val('M3').trigger('change');
				$('.reflector-select').val('D').trigger('change');				
				$('.ukw-d-setting-A').trigger({type: 'keydown', which: 66, keyCode: 66});
				$('.ukw-d-setting-C').trigger({type: 'keydown', which: 66, keyCode: 66});
				assert.equal($('.ukw-d-setting-A').val(), '', "UKW-D setting A becomes empty");
				$('.ukw-d-setting-C').trigger({type: 'keydown', which: 68, keyCode: 68});
				$('.ukw-d-setting-D').trigger({type: 'keydown', which: 65, keyCode: 65});
				assert.equal($('.ukw-d-setting-B').val(), '', "UKW-D setting B becomes empty when D takes its setting");				
				assert.equal($('.ukw-d-setting-C').val(), '', "UKW-D setting C becomes empty when its partner is paired with another setting");				
			});				
			QUnit.test("UKW-D letters J and Y are hard-wired together and may not be changed", function(assert){
				$('.enigma-machine-select').val('M3').trigger('change');
				$('.reflector-select').val('D').trigger('change');	
				$('.ukw-d-setting-A').trigger({type: 'keydown', which: 'J'.charCodeAt(), keyCode: 'J'.charCodeAt()});
				assert.equal($('.ukw-d-setting-A').val(), 'Z', "UKW-D setting A is unchanged");				
				assert.equal($('.ukw-d-setting-Z').val(), 'A', "UKW-D setting Z is unchanged");				
				assert.equal($('.ukw-d-setting-J').val(), 'Y', "UKW-D setting J is unchanged");				
				assert.equal($('.ukw-d-setting-Y').val(), 'J', "UKW-D setting Y is unchanged");
				$('.ukw-d-setting-A').trigger({type: 'keydown', which: 'J'.charCodeAt(), keyCode: 'J'.charCodeAt()});
				assert.equal($('.ukw-d-setting-A').val(), 'Z', "UKW-D setting A is unchanged");				
				assert.equal($('.ukw-d-setting-Z').val(), 'A', "UKW-D setting Z is unchanged");				
				assert.equal($('.ukw-d-setting-J').val(), 'Y', "UKW-D setting J is unchanged");				
				assert.equal($('.ukw-d-setting-Y').val(), 'J', "UKW-D setting Y is unchanged");				
			});
			
			QUnit.module("Bulk Ciphers");
			QUnit.test("Cipher one letter", function(assert){
				$('.bulk-text-input').val('A');
				$('.enigma-step').click();
				assert.equal($('.bulk-text-output').text(), 'B', "Bulk cipher, one step A -> B");
				assert.equal($('.fast-rotor-ground-setting').val(), 'B', "Ground settings are updated");
				$('.fast-rotor-ground-setting').val('A').trigger('change');
				$('.bulk-text-output').text('');
				$('.bulk-text-input').val('a');
				$('.enigma-step').click();
				assert.equal($('.bulk-text-output').text(), 'B', "Bulk cipher, lowercase input, one step a -> B");			
			});
			QUnit.test("It pops the first letter off the bulk text input when a cipher step happens", function(assert){
				$('.bulk-text-input').val('ABC');
				$('.enigma-step').click();
				assert.equal($('.bulk-text-input').val(), 'BC', "Bulk text input is BC");		
			});
			QUnit.test("It does nothing if the bulk-text-input is empty", function(assert){
				$('.enigma-step').click();
				assert.equal($('.fast-rotor-ground-setting').val(), 'A', "No change to fast rotor");		
			});		
			QUnit.test("It passes spaces in the message on to the output and ciphers the next available letter", function(assert){
				$('.bulk-text-input').val('A B');
				$('.enigma-step').click();
				$('.enigma-step').click();
				assert.equal($('.bulk-text-output').text(), 'B J', "Output is B J after two cipher steps");		
			});	
			QUnit.test("It acts on A-Z and space characters, removes the others without ciphering", function(assert){
				$('.bulk-text-input').val('A9B');
				$('.enigma-step').click();
				$('.enigma-step').click();
				assert.equal($('.bulk-text-output').text(), 'BJ', "Output is BJ after two cipher steps");		
			});	
			QUnit.test("It clears the bulk text output when the clear ciphertext button is clicked", function(assert){
				$('.bulk-text-input').val('A');
				$('.enigma-step').click();
				$('.bulk-text-output-clear').click();
				assert.equal($('.bulk-text-output').text(), 'Ciphertext output', "Bulk text output is cleared to 'Ciphertext output'");
			});
			QUnit.test("Cipher all", function(assert){
				$('.bulk-text-input').val('B');
				$('.enigma-all').click();
				assert.equal($('.bulk-text-output').text(), 'A', "Bulk cipher, all B -> A");
				assert.equal($('.fast-rotor-ground-setting').val(), 'B', "Ground settings are updated");
				$('.fast-rotor-ground-setting').val('A').trigger('change');
				$('.bulk-text-output').text('');				
				$('.bulk-text-input').val('b');
				$('.enigma-all').click();
				assert.equal($('.bulk-text-output').text(), 'A', "Bulk cipher, lowercase, all B -> A");
			});	
			QUnit.test("It clears the bulk text input when a cipher all happens", function(assert){
				$('.bulk-text-input').val('ABC');
				$('.enigma-all').click();
				assert.equal($('.bulk-text-input').val(), '', "Bulk text input is empty");		
			});			
			QUnit.test("It does nothing if the bulk-text-input is empty", function(assert){
				$('.enigma-all').click();
				assert.equal($('.fast-rotor-ground-setting').val(), 'A', "No change to fast rotor");		
			});
			QUnit.test("It passes spaces in the message on to the output", function(assert){
				$('.bulk-text-input').val('A B');
				$('.enigma-all').click();
				assert.equal($('.bulk-text-output').text(), 'B J', "Output is B J after cipher all");		
			});	
			QUnit.test("It acts on A-Z and space characters, removes the others without ciphering", function(assert){
				$('.bulk-text-input').val('A9B');
				$('.enigma-all').click();
				assert.equal($('.bulk-text-output').text(), 'BJ', "Output is BJ after two cipher steps");		
			});	
			
			QUnit.module("Toy");
			QUnit.test("It ciphers a message and updates the visualizations when the play button is clicked", function(assert){
				$('.bulk-text-input').val('AA');
				assert.equal(gui.running, false, "It is not running by default");
				$('.enigma-play').click();
				assert.equal(gui.running, true, "It enters the running state when play is clicked");
				assert.equal($('.enigma-play').text(), 'Stop', "It changes the value of the Play button to Stop while running");
				assert.equal($('.enigma-play').hasClass('active'), true, "It adds the 'active' class to the play button while running");
				var done = assert.async();
				setTimeout(function(){
					assert.equal(gui.running, false, "It exits the running state when finished");
					assert.equal($('.enigma-play').text(), 'Play', "It changes the value of the Play button to Play after running");
					assert.equal($('.enigma-play').hasClass('active'), false, "It removes the 'active' class from the play button after running");
					done();
				}, 1000);
			});
/* Timing
 Disabled because sensitive to runtime environment			
			QUnit.test("It ciphers one letter per half second when the play button is clicked", function(assert){				
				$('.bulk-text-input').val('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
				$('.enigma-play').click();
				var done = assert.async();
				setTimeout(function(){
					assert.ok($('.bulk-text-output').text().length > 1, "It has ciphered more than 1 character after 1 second");
					done();
				}, 1000);				
			});
*/			
			QUnit.test("It clears the bulk-text-output when the play button is clicked", function(assert){				
				$('.bulk-text-output').text('A');
				$('.bulk-text-input').val('A');
				$('.enigma-play').click();
				var done = assert.async();
				setTimeout(function(){
					assert.equal($('.bulk-text-output').text(), 'B', "Bulk text output was cleared before ciphering the new message");
					done();
				}, 100);				
			});
			QUnit.test("It stops playing when enigma-play is clicked while running", function(assert){				
				$('.bulk-text-input').val('AAAAAA');
				$('.enigma-play').click();
				$('.enigma-play').click();
				var done = assert.async();
				setTimeout(function(){
					assert.equal($('.bulk-text-output').text().length, 1, "Bulk text output contains one letter");
					done();
				}, 600);				
			});	
			QUnit.test("It toggles the active class on x2 and x10 when these buttons are clicked", function(assert){				
				assert.equal($('.enigma-play-x2').hasClass('active'), false, "x2 does not have the active class by default");
				$('.enigma-play-x2').click();
				assert.equal($('.enigma-play-x2').hasClass('active'), true, "x2 has the active class after it is clicked once");
				$('.enigma-play-x2').click();
				assert.equal($('.enigma-play-x2').hasClass('active'), false, "x2 does not have the active class after it is clicked twice");				
				
				assert.equal($('.enigma-play-x10').hasClass('active'), false, "x10 does not have the active class by default");
				$('.enigma-play-x10').click();
				assert.equal($('.enigma-play-x10').hasClass('active'), true, "x10 has the active class after it is clicked once");
				$('.enigma-play-x10').click();
				assert.equal($('.enigma-play-x10').hasClass('active'), false, "x10 does not have the active class after it is clicked twice");				
			});
			QUnit.test("x2 and x10 are mutually exclusive options", function(assert){				
				$('.enigma-play-x2').click();
				$('.enigma-play-x10').click();
				assert.equal($('.enigma-play-x2').hasClass('active'), false, "x2 does not have the active class after it is clicked once and then x10 is clicked once");
				assert.equal($('.enigma-play-x10').hasClass('active'), true, "x10 has the active class after x2 is clicked once, then it is clicked once");
				$('.enigma-play-x2').click();
				assert.equal($('.enigma-play-x2').hasClass('active'), true, "x2 has the active class after it is clicked twice with x10 clicked once in between");
				assert.equal($('.enigma-play-x10').hasClass('active'), false, "x10 does not have the active class after it is clicked once after x2 and before x2");				
			});			
/* Timing
 Disabled because sensitive to runtime environment			
			QUnit.test("It ciphers one letter per quarter second when the play button is clicked and the x2 button is active", function(assert){				
				$('.bulk-text-input').val('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
				$('.enigma-play-x2').click();
				$('.enigma-play').click();
				var done = assert.async();
				setTimeout(function(){
					assert.ok($('.bulk-text-output').text().length > 3, "It has ciphered more than 3 characters after 1 second");
					done();
				}, 1000);				
			});
			QUnit.test("It ciphers one letter per tenth of a second when the play button is clicked and the x10 button is active", function(assert){				
				$('.bulk-text-input').val('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
				$('.enigma-play-x10').click();
				$('.enigma-play').click();
				var done = assert.async();
				setTimeout(function(){
					assert.ok($('.bulk-text-output').text().length > 5, "It has ciphered more than 5 characters after 1 second");
					done();
				}, 1000);				
			});			
*/
			
			QUnit.module("Warnings");
			QUnit.test("Rotors should not be duplicated", function(assert){
				$('.middle-rotor-select').val('I').trigger('change');
				$('.fast-rotor-select').val('I').trigger('change');
				assert.equal($('.slow-rotor-select').parent().hasClass('bg-warning'), true, "Slow rotor");
				assert.equal($('.middle-rotor-select').parent().hasClass('bg-warning'), true, "Middle rotor");
				assert.equal($('.fast-rotor-select').parent().hasClass('bg-warning'), true, "Fast rotor");
				$('.middle-rotor-select').val('II').trigger('change');
				assert.equal($('.slow-rotor-select').parent().hasClass('bg-warning'), true, "Slow rotor");
				assert.equal($('.middle-rotor-select').parent().hasClass('bg-warning'), false, "Middle rotor");
				assert.equal($('.fast-rotor-select').parent().hasClass('bg-warning'), true, "Fast rotor");	
				$('.fast-rotor-select').val('III').trigger('change');
				assert.equal($('.slow-rotor-select').parent().hasClass('bg-warning'), false, "Slow rotor");
				assert.equal($('.middle-rotor-select').parent().hasClass('bg-warning'), false, "Middle rotor");
				assert.equal($('.fast-rotor-select').parent().hasClass('bg-warning'), false, "Fast rotor");				
			});
			QUnit.test("Plugboard with Uhr enabled should not have unpaired plugs", function(assert){
				$('.enigma-machine-plugboard-uhr').val('1').trigger('change');
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 65, keyCode: 65});
				$('.plugboard-setting-A').trigger({type: 'keydown', which: '0'.charCodeAt(), keyCode: '0'.charCodeAt()});
				assert.ok($('.plugboard-setting-A').parent().hasClass('has-warning'), "Plug setting A has warning");
				$('.plugboard-setting-B').trigger({type: 'keydown', which: 66, keyCode: 66});
				$('.plugboard-setting-B').trigger({type: 'keydown', which: '0'.charCodeAt(), keyCode: '0'.charCodeAt()});
				assert.notOk($('.plugboard-setting-A').parent().hasClass('has-warning'), "Plug setting A does not have warning");				
				assert.notOk($('.plugboard-setting-B').parent().hasClass('has-warning'), "Plug setting B does not have warning");
				$('.plugboard-setting-C').trigger({type: 'keydown', which: 65, keyCode: 65});
				$('.plugboard-setting-C').trigger({type: 'keydown', which: '0'.charCodeAt(), keyCode: '0'.charCodeAt()});
				assert.notOk($('.plugboard-setting-A').parent().hasClass('has-warning'), "Plug setting A does not have a warning");
				$('.plugboard-setting-C').trigger({type: 'keydown', which: 8, keyCode: 8});
				assert.notOk($('.plugboard-setting-C').parent().hasClass('has-warning'), "Plug setting C does not have warning");
				assert.ok($('.plugboard-setting-B').parent().hasClass('has-warning'), "Plug setting B has a warning");
				$('.plugboard-setting-D').trigger({type: 'keydown', which: 65, keyCode: 65});
				$('.plugboard-setting-D').trigger({type: 'keydown', which: '9'.charCodeAt(), keyCode: '9'.charCodeAt()});
				assert.ok($('.plugboard-setting-D').parent().hasClass('has-warning'), "Plug setting D has a warning");
				$('.plugboard-setting-E').trigger({type: 'keydown', which: 65, keyCode: 65});
				$('.plugboard-setting-E').trigger({type: 'keydown', which: '9'.charCodeAt(), keyCode: '9'.charCodeAt()});
				assert.notOk($('.plugboard-setting-D').parent().hasClass('has-warning'), "Plug setting D does not have a warning");
				$('.plugboard-setting-F').trigger({type: 'keydown', which: 65, keyCode: 65});
				$('.plugboard-setting-F').trigger({type: 'keydown', which: '8'.charCodeAt(), keyCode: '8'.charCodeAt()});
				assert.ok($('.plugboard-setting-F').parent().hasClass('has-warning'), "Plug setting F has a warning");
				$('.plugboard-setting-F').trigger({type: 'keydown', which: 65, keyCode: 65});
				$('.plugboard-setting-F').trigger('blur');	
				assert.notOk($('.plugboard-setting-F').parent().hasClass('has-warning'), "Plug setting F does not have a warning");				
			});
			QUnit.test("Plugboard with Uhr enabled should have 10 pairs connected", function(assert){
				$('.enigma-machine-plugboard-uhr').val('1').trigger('change');
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 65, keyCode: 65});
				$('.plugboard-setting-A').trigger({type: 'keydown', which: '0'.charCodeAt(), keyCode: '0'.charCodeAt()});
				assert.ok($('.plugboard-uhr-setting').parent().hasClass('has-warning'), "Uhr setting has warning class");
				for(var idx = 1; idx < 10; idx++){
					$('.plugboard-setting-' + String.fromCharCode(idx + 65)).trigger({type: 'keydown', which: 65, keyCode: 65});
					$('.plugboard-setting-' + String.fromCharCode(idx + 65)).trigger({type: 'keydown', which: String(idx).charCodeAt(), keyCode: String(idx)});						
				}
				for(var idx = 0; idx < 9; idx++){
					$('.plugboard-setting-' + String.fromCharCode(idx + 10 + 65)).trigger({type: 'keydown', which: 66, keyCode: 66});
					$('.plugboard-setting-' + String.fromCharCode(idx + 10 + 65)).trigger({type: 'keydown', which: String(idx).charCodeAt(), keyCode: String(idx)});						
				}
				assert.ok($('.plugboard-uhr-setting').parent().hasClass('has-warning'), "Uhr setting has warning class");
				$('.plugboard-setting-Z').trigger({type: 'keydown', which: 66, keyCode: 66});
				$('.plugboard-setting-Z').trigger({type: 'keydown', which: '9'.charCodeAt(), keyCode: '9'.charCodeAt()});
				assert.notOk($('.plugboard-uhr-setting').parent().hasClass('has-warning'), "Uhr setting does not have warning class");
			});
			QUnit.test("Plugboard with Uhr 10 pair warning is cleared when uhr is disabled", function(assert){
				$('.enigma-machine-plugboard-uhr').val('1').trigger('change');
				$('.plugboard-setting-A').trigger({type: 'keydown', which: 65, keyCode: 65});
				$('.plugboard-setting-A').trigger({type: 'keydown', which: '0'.charCodeAt(), keyCode: '0'.charCodeAt()});
				assert.ok($('.plugboard-uhr-setting').parent().hasClass('has-warning'), "Uhr setting has warning class");
				$('.enigma-machine-plugboard-uhr').val('0').trigger('change');	
				assert.notOk($('.plugboard-uhr-setting').parent().hasClass('has-warning'), "Uhr setting does not have warning class");				
			});
			QUnit.test("UKW-D should not have unpaired plugs", function(assert){
				$('.enigma-machine-select').val('M3').trigger('change');
				$('.reflector-select').val('D').trigger('change');	
				$('.ukw-d-setting-A').trigger({type: 'keydown', which: 'B'.charCodeAt(), keyCode: 'B'.charCodeAt()});
				assert.ok($('.ukw-d-setting-X').parent().hasClass('has-warning'), "UKW-D setting X is empty and has a warning");
				assert.ok($('.ukw-d-setting-Z').parent().hasClass('has-warning'), "UKW-D setting Z is empty and has a warning");
				$('.ukw-d-setting-Z').trigger({type: 'keydown', which: 'X'.charCodeAt(), keyCode: 'X'.charCodeAt()});
				assert.notOk($('.ukw-d-setting-X').parent().hasClass('has-warning'), "UKW-D setting X does not have a warning");
				assert.notOk($('.ukw-d-setting-Z').parent().hasClass('has-warning'), "UKW-D setting Z does not have a warning");				
			});
		});

		QUnit.module("Issues", function(hooks){
			var gui = {};
			hooks.beforeEach(function(assert){
				gui = new EnigmaMachineGUI();
				var done = assert.async();
				setTimeout(function(){
					done();				
				}, 0);
			});

			QUnit.test("GH#3 - GUI Error: Set the rotors based on GUI settings on machine type change", function(assert){
				$('.fast-rotor-select').val('VIII').trigger('change');
				$('.fast-rotor-ground-setting').val('Z').trigger('change');
				$('.enigma-machine-select').val('M3').trigger('change');
				assert.equal($('.fast-rotor-select').val(), 'VIII', "Fast rotor keeps ground setting after machine type change");
				assert.equal($('.fast-rotor-ground-setting').val(), 'Z', "Fast rotor keeps ground setting after machine type change");
				$('.enigma-io').trigger({type: 'keydown', which: 65, keyCode: 65});
				assert.equal($('.fast-rotor-ground-setting').val(), 'A', "Fast rotor advances");
				assert.equal($('.middle-rotor-ground-setting').val(), 'B', "Middle rotor advances");
			});
		});	
		
	});
})(jQuery);
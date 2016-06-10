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

// Steckerbrett
Plugboard = function(pairs = []){
	this.pairs = {};
	for(var i in pairs){
		this.pairs[pairs[i].charAt(0)] = pairs[i].charAt(1);
		this.pairs[pairs[i].charAt(1)] = pairs[i].charAt(0);
	};
}
Plugboard.prototype = {
	translate: function(letter){
		return ('undefined' != typeof(this.pairs[letter])) 
			? this.pairs[letter] 
			: letter;
	}
}

// Steckeruhr
Uhr = function(pairs = [], setting = 0){
	Plugboard.call(this, pairs);
	
	this.setting = setting;
	if(this.setting != parseInt(this.setting)){
		this.setting = 0;
	}
	if(this.setting < 0 || this.setting > 39){
		this.setting = 0;
	}
	
	this.ab_wiring = [
		 6, 31,  4, 29, 18, 39, 16, 25, 30, 23,
		28,  1, 38, 11, 36, 37, 26, 27, 24, 21,
		14,  3, 12, 17,  2,  7,  0, 33, 10, 35,
		 8,  5, 22, 19, 20, 13, 34, 15, 32,  9
	];
	
	this.b_plug_order = [6, 0, 7, 5, 1, 8, 4, 2, 9, 3];
	
	this.a_plugs = [];
	this.b_plugs = [];
	for(var i in pairs){
		this.a_plugs.push(pairs[i][0]);
		this.b_plugs.push(pairs[i][1]);
	}
}
Uhr.prototype = Object.create(Plugboard.prototype);
Uhr.prototype.constructor = Uhr;
Uhr.prototype.translate = function(letter){
	if(this.setting == 0){
		return Plugboard.prototype.translate.call(this, letter);
	}
	
	if(this.a_plugs.indexOf(letter) > -1){
		var a_wire = (this.a_plugs.indexOf(letter) * 4 + parseInt(this.setting)) % 40;
		var b_wire_position = (this.ab_wiring[a_wire] + (40 - parseInt(this.setting))) % 40;

		return ('undefined' != typeof(this.b_plugs[this.b_plug_order[Math.floor(b_wire_position / 4)]]))
			? this.b_plugs[this.b_plug_order[Math.floor(b_wire_position / 4)]]
			: '';
	}

	if(this.b_plugs.indexOf(letter) > -1){
		var b_wire = (this.b_plug_order.indexOf(parseInt([this.b_plugs.indexOf(letter)])) * 4 + parseInt(this.setting)) % 40;
		var a_wire_position = (this.ab_wiring.indexOf(b_wire) + (40 - parseInt(this.setting))) % 40;

		return ('undefined' != typeof(this.a_plugs[Math.floor(a_wire_position / 4)]))
			? this.a_plugs[Math.floor(a_wire_position / 4)]
			: '';		
	}
	
	return letter;
}

// Eintrittswalze
EntryWheel = function(cipher_map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'){
	this.wire_map = cipher_map.split('');
	this.letter_map = {};
	for(var i in this.wire_map){
		this.letter_map[this.wire_map[i]] = i;
	}
}
EntryWheel.prototype = {
	letterToWire: function(letter){
		return parseInt(this.letter_map[letter]);
	},
	wireToLetter: function(wire_position){
		return this.wire_map[wire_position];
	},
}

// Walzen
Rotor = function(configuration = {cipher_map: '', turnover_positions: ''}, deflection = 0, ring_setting = 0){
	this.encipher_map = configuration.cipher_map.split('');
	this.decipher_map = [];
	for(var i in this.encipher_map){
		this.decipher_map[this.encipher_map[i].charCodeAt() - 65] = String.fromCharCode(65 + parseInt(i));
	}

	this.turnover_positions = configuration.turnover_positions.split('');	

	this.deflection = deflection;
	this.ring_setting = ring_setting;		
}
Rotor.prototype = {
	encipher: function(wire_position){
		this.encipher_contact_position_right = (wire_position + this.deflection + (26 - this.ring_setting)) % 26;
		this.encipher_contact_position_left = this.encipher_map[this.encipher_contact_position_right].charCodeAt() - 65;
		return (this.encipher_contact_position_left + (26 - this.deflection) + this.ring_setting) % 26;
	},
	decipher: function(wire_position){
		this.decipher_contact_position_left = (wire_position + this.deflection + (26 - this.ring_setting)) % 26;
		this.decipher_contact_position_right = this.decipher_map[this.decipher_contact_position_left].charCodeAt() - 65;
		return (this.decipher_contact_position_right + (26 - this.deflection) + this.ring_setting) % 26;
	},
	step: function(){
		this.deflection = (this.deflection + 1) % 26;
	},
	isInTurnoverPosition: function(){
		for(var i in this.turnover_positions){
			if((this.turnover_positions[i].charCodeAt() - 65) == this.deflection){
				return true;
			}
		}	
		return false;
	}
}

// Umkehrwalze
ReflectorWheel = function(cipher_map = '', deflection = 0){
	this.cipher_map = cipher_map.split('');
	this.deflection = deflection;
}
ReflectorWheel.prototype = {
	cipher: function(wire_position){
		return (this.cipher_map[(wire_position + this.deflection) % 26].charCodeAt() - 65 + (26 - this.deflection)) % 26;
	},
	step: function(){
		this.deflection = (this.deflection + 1) % 26;
	}
}

// ENIGMA
EnigmaMachine = function(machine_version = 'M4', rotor_models = [], reflector_wheel_model = '', plugboard = [], uhr_setting = false){
	this.loadMachines();
	this.getMachine(machine_version);
	this.rotors = [];
	for(var i in rotor_models){
		if(Array.isArray(rotor_models[i])){
			this.rotors.push(new Rotor(this.available_rotors[rotor_models[i][0]], rotor_models[i][1], rotor_models[i][2]));
		} else {
			this.rotors.push(new Rotor(this.available_rotors[rotor_models[i]]));
		}
	}
	if(machine_version == 'M4' && reflector_wheel_model == 'D'){
		this.rotors.shift();
	}
	this.reflector_wheel = new ReflectorWheel(this.available_reflectors[reflector_wheel_model]);
	this.plugboard = !uhr_setting 
		? new Plugboard(plugboard) 
		: new Uhr(plugboard, uhr_setting);
}
EnigmaMachine.prototype = {
	loadMachines: function(){
		this.machines = {
			D: {
				label: 'Enigma D',
				cog_stepping: false,
				plugboard: false,
				entry_wheel: 'QWERTZUIOASDFGHJKPYXCVBNML',
				rotors: {
					I: {
						cipher_map: 'LPGSZMHAEOQKVXRFYBUTNICJDW',
						turnover_positions: 'Y'
					},
					II: {
						cipher_map: 'SLVGBTFXJQOHEWIRZYAMKPCNDU',
						turnover_positions: 'E'
					},
					III: {
						cipher_map: 'CJGDPSHKTURAWZXFMYNQOBVLIE',
						turnover_positions: 'N'
					}
				},
				reflectors: {
					UKW: 'IMETCGFRAYSQBZXWLHKDVUPOJN'
				}
			},
			I: {
				label: 'Enigma I (Army)',
				cog_stepping: false,
				plugboard: true,
				entry_wheel: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
				rotors: {
					I: {
						cipher_map: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
						turnover_positions: 'Q'
					},
					II: {
						cipher_map: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
						turnover_positions: 'E'
					},
					III: {
						cipher_map: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
						turnover_positions: 'V'
					},
					IV: {
						cipher_map: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
						turnover_positions: 'J'
					},
					V: {
						cipher_map: 'VZBRGITYUPSDNHLXAWMJQOFECK',
						turnover_positions: 'Z'
					}
				},
				reflectors: {
					A: 'EJMZALYXVBWFCRQUONTSPIKHGD',
					B: 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
					C: 'FVPJIAOYEDRZXWGCTKUQSBNMHL',
					D: 'ZXWVUTSRQYPONMLKIHGFEDCBJA'
				}
			},
			'Norway Enigma': {
				label: 'Norway Enigma (Norenigma)',
				cog_stepping: false,
				plugboard: true,
				entry_wheel: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
				rotors: {
					I: {
						cipher_map: 'WTOKASUYVRBXJHQCPZEFMDINLG',
						turnover_positions: 'Q'
					},
					II: {
						cipher_map: 'GJLPUBSWEMCTQVHXAOFZDRKYNI',
						turnover_positions: 'E'
					},
					III: {
						cipher_map: 'JWFMHNBPUSDYTIXVZGRQLAOEKC',
						turnover_positions: 'V'
					},
					IV: {
						cipher_map: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
						turnover_positions: 'J'
					},
					V: {
						cipher_map: 'HEJXQOTZBVFDASCILWPGYNMURK',
						turnover_positions: 'Z'
					}
				},
				reflectors: {
					UKW: 'MOWJYPUXNDSRAIBFVLKZGQCHET'
				}
			},			
			M3: {
				label: 'Enigma M3 (Army / Navy)',
				rotors: {
					VI: {
						cipher_map: 'JPGVOUMFYQBENHZRDKASXLICTW',
						turnover_positions: 'ZM'
					},
					VII: {
						cipher_map: 'NZJHGRCXMYSWBOUFAIVLPEKQDT',
						turnover_positions: 'ZM'
					},
					VIII: {
						cipher_map: 'FKQHTLXOCBJSPDZRAMEWNIUYGV',
						turnover_positions: 'ZM'
					}
				}
			},
			M4: {
				label: 'Enigma M4 (Navy)',
				rotors: {
					β: {
						thin_rotor: true,
						cipher_map: 'LEYJVCNIXWPBQMDRTAKZGFUHOS',
						turnover_positions: ''
					},
					γ: {
						thin_rotor: true,
						cipher_map: 'FSOKANUERHMBTIYCWLQPZXVGJD',
						turnover_positions: ''
					}
				},
				reflectors: {
					'B Thin': 'ENKQAUYWJICOPBLMDXZVFTHRGS',
					'C Thin': 'RDOBJNTKVEHMLFCWZAXGYIPSUQ'
				}
			},
			Zählwerk: {},
			G: {},
			'G-111': {
				rotors: {
					V: {
						cipher_map: 'QTPIXWVDFRMUSLJOHCANEZKYBG',
						turnover_positions: 'SWZFHMQ'
					}
				}
			},
			'G-260': {},
			'G-312': {},
			K: {},
			'Swiss-K': {},
			KD: {
				label: 'Enigma KD',
				cog_stepping: false,
				plugboard: false,
				entry_wheel: 'QWERTZUIOASDFGHJKPYXCVBNML',
				rotors: {
					I: {
						cipher_map: 'VEZIOJCXKYDUNTWAPLQGBHSFMR',
						turnover_positions: 'SUYAEHLNQ'
					},
					II: {
						cipher_map: 'HGRBSJZETDLVPMQYCXAOKINFUW',
						turnover_positions: 'SUYAEHLNQ'
					},
					III: {
						cipher_map: 'NWLHXGRBYOJSAZDVTPKFQMEUIC',
						turnover_positions: 'SUYAEHLNQ'
					}
				},
				reflectors: {
					UKW: 'KOTVPNLMJIAGHFBEWYXCZDQSRU'
				}				
			},
			'Railway Enigma': {
				label: 'Railway Enigma (Rocket I)',
				cog_stepping: false,
				plugboard: false,
				entry_wheel: 'QWERTZUIOASDFGHJKPYXCVBNML',
				rotors: {
					I: {
						cipher_map: 'JGDQOXUSCAMIFRVTPNEWKBLZYH',
						turnover_positions: 'N'
					},
					II: {
						cipher_map: 'NTZPSFBOKMWRCJDIVLAEYUXHGQ',
						turnover_positions: 'E'
					},
					III: {
						cipher_map: 'JVIUBHTCDYAKEQZPOSGXNRMWFL',
						turnover_positions: 'Y'
					}
				},
				reflectors: {
					UKW: 'QYHOGNECVPUZTFDJAXWMKISRBL'
				}				
			},
			T: {
				label: 'Enigma T (Tirpitz)',
				cog_stepping: false,
				plugboard: false,
				entry_wheel: 'KZROUQHYAIGBLWVSTDXFPNMCJE',
				rotors: {
					I: {
						cipher_map: 'KPTYUELOCVGRFQDANJMBSWHZXI',
						turnover_positions: 'WZEKQ'
					},
					II: {
						cipher_map: 'UPHZLWEQMTDJXCAKSOIGVBYFNR',
						turnover_positions: 'WZFLR'
					},
					III: {
						cipher_map: 'QUDLYRFEKONVZAXWHMGPJBSICT',
						turnover_positions: 'WZEKQ'
					},
					IV: {
						cipher_map: 'CIWTBKXNRESPFLYDAGVHQUOJZM',
						turnover_positions: 'WZFLR'
					},
					V: {
						cipher_map: 'UAXGISNJBVERDYLFZWTPCKOHMQ',
						turnover_positions: 'YCFKR'
					},
					VI: {
						cipher_map: 'XFUZGALVHCNYSEWQTDMRBKPIOJ',
						turnover_positions: 'XEIMQ'
					},
					VII: {
						cipher_map: 'BJVFTXPLNAYOZIKWGDQERUCHSM',
						turnover_positions: 'YCFKR'
					},
					VIII: {
						cipher_map: 'YMTPNZHWKODAJXELUQVGCBISFR',
						turnover_positions: 'XEIMQ'
					}
				},
				reflectors: {
					UKW: 'GEKPBTAUMOCNILJDXZYFHWVQSR'
				}				
			}		
		};
		$.extend(true, this.machines.M3, {
			cog_stepping: this.machines.I.cog_stepping,
			plugboard: this.machines.I.plugboard,
			entry_wheel: this.machines.I.entry_wheel,
			rotors: this.machines.I.rotors,			
			reflectors: this.machines.I.reflectors,			
		});
		delete this.machines.M3.reflectors.A;		
		$.extend(true, this.machines.M4, {
			cog_stepping: this.machines.M3.cog_stepping,
			plugboard: this.machines.M3.plugboard,
			entry_wheel: this.machines.M3.entry_wheel,
			rotors: this.machines.M3.rotors
		});
		$.extend(true, this.machines.M4.reflectors, {
			D: this.machines.M3.reflectors.D
		});
		$.extend(true, this.machines.Zählwerk, this.machines.D);
		this.machines.Zählwerk.label = 'Zählwerk (A-865)';
		this.machines.Zählwerk.cog_stepping = true;
		this.machines.Zählwerk.rotors.I.turnover_positions = 'SUVWZABCEFGIKLOPQ';
		this.machines.Zählwerk.rotors.II.turnover_positions = 'STVYZACDFGHKMNQ';
		this.machines.Zählwerk.rotors.III.turnover_positions = 'UWXAEFHKMNR';
		$.extend(true, this.machines.G, this.machines.Zählwerk);
		this.machines.G.label = 'Enigma G (G-31)';
		$.extend(true, this.machines['G-111'], this.machines.G);
		this.machines['G-111'].label = 'Enigma G (G-111)';
		this.machines['G-111'].rotors.I.cipher_map = 'WLRHBQUNDKJCZSEXOTMAGYFPVI';
		this.machines['G-111'].rotors.II.cipher_map = 'TFJQAZWMHLCUIXRDYGOEVBNSKP';
		delete this.machines['G-111'].rotors.III;
		$.extend(true, this.machines['G-260'], this.machines.G);
		this.machines['G-260'].label = 'Enigma G (G-260)';
		this.machines['G-260'].rotors.I.cipher_map = 'RCSPBLKQAUMHWYTIFZVGOJNEXD';
		this.machines['G-260'].rotors.II.cipher_map = 'WCMIBVPJXAROSGNDLZKEYHUFQT';		
		this.machines['G-260'].rotors.III.cipher_map = 'FVDHZELSQMAXOKYIWPGCBUJTNR';		
		$.extend(true, this.machines['G-312'], this.machines.G);
		this.machines['G-312'].label = 'Enigma G (G-312)';		
		this.machines['G-312'].rotors.I.cipher_map = 'DMTWSILRUYQNKFEJCAZBPGXOHV';
		this.machines['G-312'].rotors.II.cipher_map = 'HQZGPJTMOBLNCIFDYAWVEUSRKX';		
		this.machines['G-312'].rotors.III.cipher_map = 'UQNTLSZFMREHDPXKIBVYGJCWOA';			
		this.machines['G-312'].reflectors.UKW = 'RULQMZJSYGOCETKWDAHNBXPVIF';
		$.extend(true, this.machines.K, this.machines.D);
		this.machines.K.label = 'Enigma K';
		$.extend(true, this.machines['Swiss-K'], this.machines.K);
		this.machines['Swiss-K'].label = 'Swiss-K';
		this.machines['Swiss-K'].rotors.I.cipher_map = 'PEZUOHXSCVFMTBGLRINQJWAYDK';
		this.machines['Swiss-K'].rotors.II.cipher_map = 'ZOUESYDKFWPCIQXHMVBLGNJRAT';		
		this.machines['Swiss-K'].rotors.III.cipher_map = 'EHRVXGAOBQUSIMZFLYNWKTPDJC';		
	},
	getMachine: function(machine_version){
		this.machine_version = machine_version;
		this.cog_stepping = this.machines[machine_version].cog_stepping;
		this.has_plugboard = this.machines[machine_version].plugboard;
		this.entry_wheel = new EntryWheel(this.machines[machine_version].entry_wheel);
		this.available_rotors = this.machines[machine_version].rotors;
		this.available_reflectors = this.machines[machine_version].reflectors;
	},
	cipher: function(message){
		var result = '';
		for(var i in message.split('')){
			result += (message[i] == ' ') ? ' ' : this.cipherLetter(message[i]);
		}
		return result;
	},
	cipherLetter: function(letter){
		if(letter < 'A'.charCodeAt() || letter > 'Z'.charCodeAt()){
			return '';
		}
		this.stepRotors();
		var plugboard_output = this.plugboard.translate(letter);
		if(plugboard_output == ''){
			return '';
		}
		var rotor_input_wire_position = this.entry_wheel.letterToWire(plugboard_output);
		for(var idx = this.rotors.length; idx > 0; idx--){
			rotor_input_wire_position = this.rotors[idx - 1].encipher(rotor_input_wire_position);
		}
		if(this.reflector_wheel.cipher_map[rotor_input_wire_position] == ''){
			return '';
		}
		rotor_input_wire_position = this.reflector_wheel.cipher(rotor_input_wire_position);
		for(var idx = 0; idx < this.rotors.length; idx++){
			rotor_input_wire_position = this.rotors[idx].decipher(rotor_input_wire_position);
		}
		var plugboard_input = this.entry_wheel.wireToLetter(rotor_input_wire_position);
		var result = this.plugboard.translate(plugboard_input);
		return result;
	},
	stepRotors: function(){
		if(this.cog_stepping){
			if(this.rotors[2].isInTurnoverPosition()){
				if(this.rotors[1].isInTurnoverPosition()){
					if(this.rotors[0].isInTurnoverPosition()){
						this.reflector_wheel.step();
					}
					this.rotors[0].step();
				}
				this.rotors[1].step();
			}
			this.rotors[2].step();
		} else {
			var fast_rotor_index = this.rotors.length - 1;
			if(this.rotors[fast_rotor_index - 1].isInTurnoverPosition()){
				this.rotors[fast_rotor_index - 2].step();
				// The double step!
				this.rotors[fast_rotor_index - 1].step();
			} else if(this.rotors[fast_rotor_index].isInTurnoverPosition()){
				this.rotors[fast_rotor_index - 1].step();
			}
			this.rotors[fast_rotor_index].step();
		}
	}
}
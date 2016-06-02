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

// Eintrittswalze
StaticRotor = function(){}
StaticRotor.prototype = {
	letterToWire: function(letter){
		return letter.charCodeAt() - 65;
	},
	wireToLetter: function(wire_position){
		return String.fromCharCode(wire_position + 65);
	},
}

// Walzen
Rotor = function(model_label, deflection = 0, ring_setting = 0){
	this.encipher_map = [];
	this.decipher_map = [];
	this.turnover_positions = [];
	var model = '';
	if('I' == model_label){
		model = 'EKMFLGDQVZNTOWYHXUSPAIBRCJ';
		this.turnover_positions = ['Q'];
	} else if('II' == model_label){
		model = 'AJDKSIRUXBLHWTMCQGZNPYFVOE';
		this.turnover_positions = ['E'];
	} else if('III' == model_label){
		model = 'BDFHJLCPRTXVZNYEIWGAKMUSQO';
		this.turnover_positions = ['V'];
	} else if('IV' == model_label){
		model = 'ESOVPZJAYQUIRHXLNFTGKDCMWB';
		this.turnover_positions = ['J'];
	} else if('V' == model_label){
		model = 'VZBRGITYUPSDNHLXAWMJQOFECK';
		this.turnover_positions = ['Z'];
	} else if('VI' == model_label){
		model = 'JPGVOUMFYQBENHZRDKASXLICTW';
		this.turnover_positions = ['Z', 'M'];
	} else if('VII' == model_label){
		model = 'NZJHGRCXMYSWBOUFAIVLPEKQDT';
		this.turnover_positions = ['Z', 'M'];
	} else if('VIII' == model_label){
		model = 'FKQHTLXOCBJSPDZRAMEWNIUYGV';
		this.turnover_positions = ['Z', 'M'];
	} else if('Beta' == model_label){
		model = 'LEYJVCNIXWPBQMDRTAKZGFUHOS';
		this.turnover_positions = [''];
	} else if('Gamma' == model_label){
		model = 'FSOKANUERHMBTIYCWLQPZXVGJD';
		this.turnover_positions = [''];
	}
	for(var i in model){
		if(model.hasOwnProperty(i)){
			this.encipher_map[i] = model[i];
			this.decipher_map[model[i].charCodeAt() - 65] = String.fromCharCode(65 + parseInt(i));
		}
	}
	this.deflection = deflection;
	this.ring_setting = ring_setting;	
}
Rotor.prototype = {
	encipher: function(wire_position){
		var contact_position_right = (wire_position + this.deflection + (26 - this.ring_setting)) % 26;
		var contact_position_left = this.encipher_map[contact_position_right].charCodeAt() - 65;
		return (contact_position_left + (26 - this.deflection) + this.ring_setting) % 26;
	},
	decipher: function(wire_position){
		var contact_position_right = (wire_position + this.deflection + (26 - this.ring_setting)) % 26;
		var contact_position_left = this.decipher_map[contact_position_right].charCodeAt() - 65;
		return (contact_position_left + (26 - this.deflection) + this.ring_setting) % 26;
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
ReflectorWheel = function(model_label){
	if('B' == model_label){
		this.cipher_map = 'YRUHQSLDPXNGOKMIEBFZCWVJAT'.split('');
	} else if('C' == model_label){
		this.cipher_map = 'FVPJIAOYEDRZXWGCTKUQSBNMHL'.split('');
	} else if('B Thin' == model_label){
		this.cipher_map = 'ENKQAUYWJICOPBLMDXZVFTHRGS'.split('');
	} else if('C Thin' == model_label){
		this.cipher_map = 'RDOBJNTKVEHMLFCWZAXGYIPSUQ'.split('');
	} else this.cipher_map = '';
}
ReflectorWheel.prototype = {
	cipher: function(wire_position){
		return this.cipher_map[wire_position].charCodeAt() - 65;
	}
}

// ENIGMA
EnigmaMachine = function(rotor_models = [], reflector_wheel_model = '', plugboard = []){
	this.static_rotor = new StaticRotor();
	this.rotors = [];
	for(var i in rotor_models){
		if(rotor_models.hasOwnProperty(i)){
			if(Array.isArray(rotor_models[i])){
				this.rotors.push(new Rotor(rotor_models[i][0], rotor_models[i][1], rotor_models[i][2]));
			} else {
				this.rotors.push(new Rotor(rotor_models[i]));
			}
		}
	}
	this.reflector_wheel = new ReflectorWheel(reflector_wheel_model);
	this.plugboard = new Plugboard(plugboard);
}
EnigmaMachine.prototype = {
	cipher: function(message){
		var result = '';
		for(var i in message.split('')){
			result += this.cipherLetter(message[i]);
		}
		return result;
	},
	cipherLetter: function(letter){
		this.stepRotors();
		var plugboard_output = this.plugboard.translate(letter);
		var rotor_input_wire_position = this.static_rotor.letterToWire(plugboard_output);
		for(var idx = this.rotors.length; idx > 0; idx--){
			rotor_input_wire_position = this.rotors[idx - 1].encipher(rotor_input_wire_position);
		}
		rotor_input_wire_position = this.reflector_wheel.cipher(rotor_input_wire_position);
		for(var idx = 0; idx < this.rotors.length; idx++){
			rotor_input_wire_position = this.rotors[idx].decipher(rotor_input_wire_position);
		}
		var plugboard_input = this.static_rotor.wireToLetter(rotor_input_wire_position);
		var result = this.plugboard.translate(plugboard_input);
		return result;
	},
	stepRotors: function(){
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
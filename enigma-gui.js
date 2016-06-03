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
		drawInterface();
		
		makeEnigmaMachineFromSettings();
	
		drawField();
		
		// Delay to allow DOM to update
		setTimeout(function(){
			drawWires();
		}, 250);
		displayRotorPositions();
		
		$('.plugboard-settings-field input').keydown(function(e){
			e.preventDefault();
			if(e.which < 'A'.charCodeAt() || e.which > 'Z'.charCodeAt()){
				return;
			}
			if(e.which == $(this).attr('data-letter').charCodeAt()){
				return;
			}
			$('.plugboard-settings-field input').each(function(){
				if(e.which == $(this).val().charCodeAt()){
					$(this).val('');
				}
				if($(this).val() == $(this).attr('data-letter')){
					$(this).val('');
				}
			});
			$(this).val(String.fromCharCode(e.which));			
			$('.plugboard-setting-' + String.fromCharCode(e.which)).val($(this).attr('data-letter'));
		});
		
		$('#enigma-modal').on('hidden.bs.modal', function(){
			makeEnigmaMachineFromSettings();
			reconnectLampsKeysToPlugboard();
		});	
		
		$('.fast-rotor-select').change(function(){
			makeEnigmaMachineFromSettings();
			redrawFastRotor();
			displayRotorPositions();
		});
		$('.fast-rotor-ring-setting').change(function(){
			makeEnigmaMachineFromSettings();
			redrawFastRotor();
			displayRotorPositions();
		});
		$('.rotor-fast-display').change(function(){
			makeEnigmaMachineFromSettings();
			redrawFastRotor();
			displayRotorPositions();
		});		
		$('.middle-rotor-select').change(function(){
			makeEnigmaMachineFromSettings();
			redrawMiddleRotor();
			displayRotorPositions();
		});
		$('.middle-rotor-ring-setting').change(function(){
			makeEnigmaMachineFromSettings();
			redrawMiddleRotor();
			displayRotorPositions();
		});
		$('.rotor-middle-display').change(function(){
			makeEnigmaMachineFromSettings();
			redrawMiddleRotor();
			displayRotorPositions();
		});
		$('.slow-rotor-select').change(function(){
			makeEnigmaMachineFromSettings();
			redrawSlowRotor();
			displayRotorPositions();
		});
		$('.slow-rotor-ring-setting').change(function(){
			makeEnigmaMachineFromSettings();
			redrawSlowRotor();
			displayRotorPositions();
		});
		$('.rotor-slow-display').change(function(){
			makeEnigmaMachineFromSettings();
			redrawSlowRotor();
			displayRotorPositions();
		});
		$('.reflector-select').change(function(){
			$('.reflector-wire').remove();
			makeEnigmaMachineFromSettings();
			connectReflectorInternalWiring();
			displayRotorPositions();
		});
		
		$('.keyboard-input').keydown(function(e){
			if(e.ctrlKey || e.altKey || e.metaKey || e.which < 'A'.charCodeAt() || e.which > 'Z'.charCodeAt()){
				return;
			}
			
			clearAllHotWires();
			
			var slow_deflection = enigma.rotors[0].deflection;
			var middle_deflection = enigma.rotors[1].deflection;
			
			var result = enigma.cipher(String.fromCharCode(e.which));
			
			e.preventDefault();
			$('.keyboard-input').val(String.fromCharCode(e.which) + ' -> ' + result + '  ').attr('data-last-cipher', result);			
			
			if(slow_deflection != enigma.rotors[0].deflection){
				redrawSlowRotor();
			}
			if(middle_deflection != enigma.rotors[1].deflection){
				redrawMiddleRotor();
			}
			redrawFastRotor();
			
			displayRotorPositions();			
			
			$('.lampboard-keyboard .alphabet-' + String.fromCharCode(e.which)).addClass('hot-in');
			$('.plugboard-wire-' + String.fromCharCode(e.which)).addClass('hot-in');
			
			$('.lampboard-keyboard .alphabet-' + result).addClass('hot-out');
			$('.plugboard-wire-' + result).addClass('hot-out');
			
			var wire_position = enigma.static_rotor.letterToWire(enigma.plugboard.translate(String.fromCharCode(e.which)));
			
			$('.plugboard .alphabet-' + String.fromCharCode(wire_position + 65)).addClass('hot-in');
			$('.plugboard .alphabet-' + result).addClass('hot-out');
			
			var rotors = ['rotor-fast', 'rotor-middle', 'rotor-slow'];
			
			for(var i in rotors){
				var rotor_right = (wire_position + enigma.rotors[2 - i].deflection + (26 - enigma.rotors[2 - i].ring_setting)) % 26;
				$('.' + rotors[i] + ' .alphabet-pair-right .alphabet-' + String.fromCharCode((rotor_right + enigma.rotors[2 - i].ring_setting) % 26 + 65)).addClass('hot-in');
				$('.' + rotors[i] + '-wire-' + String.fromCharCode((rotor_right + enigma.rotors[2 - i].ring_setting) % 26 + 65)).addClass('hot-in');
				$('.' + rotors[i] + ' .alphabet-pair-left .alphabet-' + String.fromCharCode((enigma.rotors[2 - i].encipher_map[rotor_right].charCodeAt() - 65 + enigma.rotors[2 - i].ring_setting) % 26 + 65)).addClass('hot-in');
				$('.' + rotors[i] + ' .alphabet-hint-set .alphabet-' + String.fromCharCode(enigma.rotors[2 - i].encipher(wire_position) + 65)).addClass('hot-in');
				wire_position = enigma.rotors[2 - i].encipher(wire_position);
			}
			
			if(wire_position < enigma.reflector_wheel.cipher(wire_position)){
				$('.reflector .alphabet-' + String.fromCharCode(wire_position + 65)).addClass('hot-in');
				$('.reflector-wire-in-' + String.fromCharCode(wire_position + 65)).addClass('hot-in');
				$('.reflector-wire-middle-' + String.fromCharCode(wire_position + 65)).addClass('hot-in-out');
				$('.reflector-wire-out-' + String.fromCharCode(wire_position + 65)).addClass('hot-out');
				
				wire_position = enigma.reflector_wheel.cipher(wire_position);
				$('.reflector .alphabet-' + String.fromCharCode(wire_position + 65)).addClass('hot-out');				
			} else {
				$('.reflector .alphabet-' + String.fromCharCode(wire_position + 65)).addClass('hot-in');				
				
				wire_position = enigma.reflector_wheel.cipher(wire_position);
				$('.reflector .alphabet-' + String.fromCharCode(wire_position + 65)).addClass('hot-out');
				$('.reflector-wire-in-' + String.fromCharCode(wire_position + 65)).addClass('hot-out');
				$('.reflector-wire-middle-' + String.fromCharCode(wire_position + 65)).addClass('hot-out-in');
				$('.reflector-wire-out-' + String.fromCharCode(wire_position + 65)).addClass('hot-in');				
			}
			
			var rotors = ['rotor-slow', 'rotor-middle', 'rotor-fast'];
			
			for(var i in rotors){
				$('.' + rotors[i] + ' .alphabet-hint-set .alphabet-' + String.fromCharCode(wire_position + 65)).addClass('hot-out');				
				var rotor_left = (wire_position + enigma.rotors[i].deflection + (26 - enigma.rotors[i].ring_setting)) % 26;
				$('.' + rotors[i] + ' .alphabet-pair-right .alphabet-' + String.fromCharCode((enigma.rotors[i].decipher_map[rotor_left].charCodeAt() - 65 + enigma.rotors[i].ring_setting) % 26 + 65)).addClass('hot-out');
				$('.' + rotors[i] + ' .alphabet-pair-left .alphabet-' + String.fromCharCode((rotor_left + enigma.rotors[i].ring_setting) % 26 + 65)).addClass('hot-out');
				$('.' + rotors[i] + '-wire-' + String.fromCharCode((enigma.rotors[i].decipher_map[rotor_left].charCodeAt() - 65 + enigma.rotors[i].ring_setting) % 26 + 65)).addClass('hot-out');
				
				wire_position = enigma.rotors[i].decipher(wire_position);				
			}
		});
		
		var resizer = {};
		$(window).resize(function(){
			$('.rotor-fast-wire').remove();
			$('.rotor-middle-wire').remove();
			$('.rotor-slow-wire').remove();
			$('.reflector-wire').remove();
			$('.plugboard-wire').remove();
			clearTimeout(resizer);
			resizer = setTimeout(function(){
				drawWires();
			}, 250);
		});
		
		$('.cipher-step').click(function(){
			if($('.bulk-text-input').val().length > 0){
				var letter = $('.bulk-text-input').val()[0].toUpperCase().charCodeAt();
				$('.bulk-text-input').val($('.bulk-text-input').val().substr(1));				
				if(letter < 'A'.charCodeAt() || letter > 'Z'.charCodeAt()){
					if(letter == ' '.charCodeAt()){
						$('.bulk-text-output').append(' ');
					}
					return;
				}
				$('.keyboard-input').trigger({type: 'keydown', which: letter, keyCode: letter});
				if('Ciphertext comes out here' == $('.bulk-text-output').text()){
					$('.bulk-text-output').empty();
				}
				$('.bulk-text-output').append($('.keyboard-input').attr('data-last-cipher'));
			}
		});
		
		$('.cipher-all').click(function(){
			if($('.bulk-text-input').val().length > 0){
				$('.bulk-text-output').empty().append(enigma.cipher($('.bulk-text-input').val()));
				displayRotorPositions();
			}
		});		
		
		$('.bulk-text-output-clear').click(function(){
			$('.bulk-text-output').text('Ciphertext comes out here');
		});
		
		$('.cipher-play').click(function(){
			bulkTextCipher();
		});			
	});
	
	function bulkTextCipher(){
		if($('.bulk-text-input').val().length > 0){
			$('.cipher-step').click();
			setTimeout(function(){
				bulkTextCipher();
			}, 500);
		}		
	}
	
	function clearAllHotWires(){
		$('.alphabet-set div div').each(function(idx, item){
			$(item).removeClass('hot-in');
			$(item).removeClass('hot-out');
		});
		$('.alphabet-hint-set div').each(function(idx, item){
			$(item).removeClass('hot-in');
			$(item).removeClass('hot-out');
		});
		$('.wire').removeClass('hot-in').removeClass('hot-out').removeClass('hot-in-out').removeClass('hot-out-in');		
	}
	
	function redrawSlowRotor(){
		$('.rotor-slow .rotor_field').empty();
		$('.rotor-slow-wire').remove();
		drawSlowRotorField();
		connectSlowRotorInternalWiring();		
	}

	function redrawMiddleRotor(){
		$('.rotor-middle .rotor_field').empty();
		$('.rotor-middle-wire').remove();
		drawMiddleRotorField();
		connectMiddleRotorInternalWiring();		
	}

	function redrawFastRotor(){
		$('.rotor-fast .rotor_field').empty();
		$('.rotor-fast-wire').remove();
		drawFastRotorField();
		connectFastRotorInternalWiring();		
	}
	
	function drawWires(){
		connectLampsKeysToPlugboard();
		connectReflectorInternalWiring();
		connectFastRotorInternalWiring();
		connectMiddleRotorInternalWiring();
		connectSlowRotorInternalWiring();		
	}
	
	function drawInterface(){
		for(var idx = 0; idx < 26; idx++){
			var option_element = $(document.createElement('option')).val(String.fromCharCode(idx + 65)).append(String.fromCharCode(idx + 65));
			$('.slow-rotor-ring-setting').append(option_element.clone());
			$('.middle-rotor-ring-setting').append(option_element.clone());
			$('.fast-rotor-ring-setting').append(option_element.clone());
			$('.rotor-slow-display').append(option_element.clone());
			$('.rotor-middle-display').append(option_element.clone());
			$('.rotor-fast-display').append(option_element.clone());
		}	

		var row = $(document.createElement('div')).addClass('row');
		var column = $(document.createElement('div')).addClass('col-xs-4');
		var input_group = $(document.createElement('div')).addClass('input-group');
		var input_addon = $(document.createElement('div')).addClass('input-group-addon');
		var input = $(document.createElement('input')).attr('type', 'text').addClass('form-control');
		for(var idx = 0; idx < 9; idx++){
			column.append(input_group.clone().append(input_addon.clone().append(String.fromCharCode(idx + 65))).append(input.clone().attr('data-letter', String.fromCharCode(idx + 65)).addClass('plugboard-setting-' + String.fromCharCode(idx + 65))));
		}
		row.append(column.clone());
		column.empty();
		for(var idx = 9; idx < 18; idx++){
			column.append(input_group.clone().append(input_addon.clone().append(String.fromCharCode(idx + 65))).append(input.clone().attr('data-letter', String.fromCharCode(idx + 65)).addClass('plugboard-setting-' + String.fromCharCode(idx + 65))));
		}
		row.append(column.clone());
		column.empty();
		for(var idx = 18; idx < 26; idx++){
			column.append(input_group.clone().append(input_addon.clone().append(String.fromCharCode(idx + 65))).append(input.clone().attr('data-letter', String.fromCharCode(idx + 65)).addClass('plugboard-setting-' + String.fromCharCode(idx + 65))));
		}
		row.append(column.clone());
		$('.plugboard-settings-field').append(row);	
	}
	
	function makeEnigmaMachineFromSettings(){
		clearAllHotWires();
		
		var plugboard_connected = [];
		var plugboard = [];
		$('.plugboard-settings-field input').each(function(){
			if(plugboard_connected.indexOf($(this).attr('data-letter')) > -1){
				return;
			}
			if($(this).val().length > 0){
				plugboard.push($(this).attr('data-letter') + $(this).val());
				plugboard_connected.push($(this).attr('data-letter'));
			}
		});
		enigma = new EnigmaMachine(
			[
				[$('.slow-rotor-select').val(), $('.rotor-slow-display').val().charCodeAt() - 65, $('.slow-rotor-ring-setting').val().charCodeAt() - 65],
				[$('.middle-rotor-select').val(), $('.rotor-middle-display').val().charCodeAt() - 65, $('.middle-rotor-ring-setting').val().charCodeAt() - 65], 
				[$('.fast-rotor-select').val(), $('.rotor-fast-display').val().charCodeAt() - 65, $('.fast-rotor-ring-setting').val().charCodeAt() - 65]
			],
			$('.reflector-select').val(),
			plugboard
		);
	}
	
	function drawField(){
		var alphabet_set = $(document.createElement('div')).addClass('center-block').addClass('alphabet-set');
		var evens = $(document.createElement('div')).addClass('alphabet-evens');
		for(var idx = 0; idx < 26; idx += 2){
			evens.append($(document.createElement('div')).addClass('alphabet-' + String.fromCharCode(idx + 65)).append(String.fromCharCode(idx + 65)));
		}
		var odds = $(document.createElement('div')).addClass('alphabet-odds');
		for(var idx = 1; idx < 26; idx += 2){
			odds.append($(document.createElement('div')).addClass('alphabet-' + String.fromCharCode(idx + 65)).append(String.fromCharCode(idx + 65)));
		}
		odds.addClass('alphabet-offset');
		alphabet_set.append(evens.clone().addClass('alphabet-left')).append(odds.clone().addClass('alphabet-right'));
		
		$('.lampboard-keyboard').append(alphabet_set.clone());		
		$('.plugboard').append(alphabet_set.clone());
		$('.reflector').append(alphabet_set.clone().removeClass('center-block').addClass('pull-right'));		
		
		var alphabet_hint_set = $(document.createElement('div')).addClass('center-block').addClass('alphabet-hint-set');
		for(var idx = 0; idx < 26; idx++){
			alphabet_hint_set.append($(document.createElement('div')).addClass('alphabet-' + String.fromCharCode(idx + 65)).append('- ' + String.fromCharCode(idx + 65) + ' -'));
		}

		$('.rotor-slow').append(alphabet_hint_set.clone()).append($(document.createElement('div')).addClass('rotor_field'));
		$('.rotor-middle').append(alphabet_hint_set.clone()).append($(document.createElement('div')).addClass('rotor_field'));
		$('.rotor-fast').append(alphabet_hint_set.clone()).append($(document.createElement('div')).addClass('rotor_field'));
		
		drawRotorFields();
	}
	
	function drawRotorFields(){
		drawSlowRotorField();
		drawMiddleRotorField();
		drawFastRotorField();
	}
	
	function drawSlowRotorField(){
		$('.rotor-slow .rotor_field').append(createRotorField(enigma.rotors[0]));
	}
	
	function drawMiddleRotorField(){
		$('.rotor-middle .rotor_field').append(createRotorField(enigma.rotors[1]));
	}
	
	function drawFastRotorField(){
		$('.rotor-fast .rotor_field').append(createRotorField(enigma.rotors[2]));
	}
	
	function createRotorField(rotor){
		var alphabet_set = $(document.createElement('div')).addClass('center-block').addClass('alphabet-set');				
		var evens = $(document.createElement('div')).addClass('alphabet-evens');
		for(var idx = 0; idx < 13; idx++){
			evens.append($(document.createElement('div')).addClass('alphabet-' + String.fromCharCode(((idx + Math.ceil(rotor.deflection / 2)) * 2) % 26 + 65)).append(String.fromCharCode(((idx + Math.ceil(rotor.deflection  / 2)) * 2) % 26 + 65)));
		}
		var odds = $(document.createElement('div')).addClass('alphabet-odds');
		for(var idx = 0; idx < 13; idx++){
			odds.append($(document.createElement('div')).addClass('alphabet-' + String.fromCharCode(((idx + Math.floor(rotor.deflection / 2)) * 2 + 1) % 26 + 65)).append(String.fromCharCode(((idx + Math.floor(rotor.deflection / 2)) * 2 + 1) % 26 + 65)));
		}
		if(rotor.deflection % 2){
			evens.addClass('alphabet-offset');
		} else {
			odds.addClass('alphabet-offset');
		}
		
		alphabet_set.append(evens.clone().addClass('alphabet-left')).append(odds.clone().addClass('alphabet-right'));		
		alphabet_set.find('.alphabet-' + String.fromCharCode(rotor.ring_setting + 65)).addClass('alphabet-ring-setting');
		
		var alphabet_set_pair = $(document.createElement('div')).addClass('alphabet-set');
		alphabet_set_pair.append(evens.clone().addClass('alphabet-right'));
		alphabet_set_pair.append(odds.clone().addClass('alphabet-left'));
		alphabet_set_pair.find('.alphabet-' + String.fromCharCode(rotor.ring_setting + 65)).addClass('alphabet-ring-setting');
		
		var rotor_field = $(document.createElement('div'));
		rotor_field.append(alphabet_set.clone().removeClass('center-block').addClass('alphabet-pair-left'));
		rotor_field.append(alphabet_set_pair.clone().addClass('alphabet-pair-right'));

		return rotor_field;
	}
	
	function reconnectLampsKeysToPlugboard(){
		$('.plugboard-wire').remove();
		connectLampsKeysToPlugboard();
	}
	
	function connectLampsKeysToPlugboard(){
		var adjustment_source = -2; // tweak to get lines in the right places
		var adjustment_destination = -1; // tweak to get lines in the right places
		for(var idx = 0; idx < 26; idx++){
			var source_element = $('.lampboard-keyboard .alphabet-' + String.fromCharCode(idx + 65));
			if(enigma.plugboard.pairs.hasOwnProperty(String.fromCharCode(idx + 65))){
				var destination_element = $('.plugboard .alphabet-' + enigma.plugboard.pairs[String.fromCharCode(idx + 65)]);
				var destination_index = enigma.plugboard.pairs[String.fromCharCode(idx + 65)].charCodeAt() - 65;
			} else {
				var destination_element = $('.plugboard .alphabet-' + String.fromCharCode(idx + 65));
				var destination_index = idx;
			}
			
			var source_letter_box_offset = source_element.offset();
			var destination_letter_box_offset = destination_element.offset();
			var source_position = {left: Math.floor(source_letter_box_offset.left - 7), top: source_letter_box_offset.top + adjustment_source + (source_element.height() / 2)};
			var destination_position = {left: Math.floor(destination_letter_box_offset.left + destination_element.width() + 7), top: destination_letter_box_offset.top + adjustment_destination + (destination_element.height() / 2)};
			
			$('body').append(createWire(source_position.left, source_position.top, source_position.left - (idx % 2 ? 29 : 10), source_position.top).addClass('plugboard-wire').addClass('plugboard-wire-' + String.fromCharCode(idx + 65)));
			$('body').append(createWire(destination_position.left, destination_position.top, destination_position.left + (destination_index % 2 ? 10 : 24), destination_position.top).addClass('plugboard-wire').addClass('plugboard-wire-' + String.fromCharCode(idx + 65)));
			$('body').append(createWire(source_position.left - (idx % 2 ? 29 : 10), source_position.top, destination_position.left + (destination_index % 2 ? 10 : 24), destination_position.top + adjustment_destination).addClass('plugboard-wire').addClass('plugboard-wire-' + String.fromCharCode(idx + 65)));
		}
	}
	
	function connectReflectorInternalWiring(){
		var adjustment_source = -2; // tweak to get lines in the right places
		var adjustment_destination = -1; // tweak to get lines in the right places	
		var connected_letters = [];
		var wire_depth = 0;
		for(var idx = 0; idx < 26; idx++){
			if(connected_letters.indexOf(String.fromCharCode(idx + 65)) > -1){
				continue;
			}
			var source_element = $('.reflector .alphabet-' + String.fromCharCode(idx + 65));
			var destination_element = $('.reflector .alphabet-' + enigma.reflector_wheel.cipher_map[idx]);
			var destination_index = enigma.reflector_wheel.cipher_map[idx].charCodeAt() - 65;
			
			var source_letter_box_offset = source_element.offset();
			var destination_letter_box_offset = destination_element.offset();
			var source_position = {left: Math.floor(source_letter_box_offset.left - 7), top: source_letter_box_offset.top + adjustment_source + (source_element.height() / 2)};
			var destination_position = {left: Math.floor(destination_letter_box_offset.left - 7), top: destination_letter_box_offset.top + adjustment_destination + (destination_element.height() / 2)};
			
			$('body').append(createWire(source_position.left, source_position.top, source_position.left - (idx % 2 ? 29 : 10) - wire_depth * 8, source_position.top).addClass('reflector-wire').addClass('reflector-wire-in-' + String.fromCharCode(idx + 65)));
			$('body').append(createWire(destination_position.left, destination_position.top, destination_position.left - (destination_index % 2 ? 29 : 10) - wire_depth * 8, destination_position.top).addClass('reflector-wire').addClass('reflector-wire-out-' + String.fromCharCode(idx + 65)));
			$('body').append(createWire(source_position.left - (idx % 2 ? 29 : 10) - wire_depth * 8, source_position.top, destination_position.left - (destination_index % 2 ? 29 : 10) - wire_depth * 8, destination_position.top + adjustment_destination + 1).addClass('reflector-wire').addClass('reflector-wire-middle-' + String.fromCharCode(idx + 65)));
			
			wire_depth++;
			connected_letters.push(String.fromCharCode(destination_index + 65));
		}
	}
	
	function connectFastRotorInternalWiring(){
		connectRotorInternalWiring('.rotor-fast', enigma.rotors[2]);
	}

	function connectMiddleRotorInternalWiring(){
		connectRotorInternalWiring('.rotor-middle', enigma.rotors[1]);
	}

	function connectSlowRotorInternalWiring(){
		connectRotorInternalWiring('.rotor-slow', enigma.rotors[0]);
	}
	
	function connectRotorInternalWiring(target_element, rotor){
		var adjustment_source = -2; // tweak to get lines in the right places
		var adjustment_destination = -1; // tweak to get lines in the right places
		for(var idx = 0; idx < 26; idx++){
			var source_element = $(target_element + ' .alphabet-pair-right .alphabet-' + String.fromCharCode(idx + 65));
			var destination_element = $(target_element + ' .alphabet-pair-left .alphabet-' + String.fromCharCode(((rotor.encipher_map[(idx + (26 - rotor.ring_setting)) % 26].charCodeAt() - 65) + rotor.ring_setting) % 26 + 65));
			
			var source_letter_box_offset = source_element.offset();
			var destination_letter_box_offset = destination_element.offset();
			var source_position = {left: Math.floor(source_letter_box_offset.left - 7), top: source_letter_box_offset.top + adjustment_source + (source_element.height() / 2)};
			var destination_position = {left: Math.floor(destination_letter_box_offset.left + destination_element.width() + 7), top: destination_letter_box_offset.top + adjustment_destination + (destination_element.height() / 2)};
			
			$('body').append(createWire(source_position.left, source_position.top, source_position.left - (idx % 2 ? 10 : 25), source_position.top).addClass(target_element.substr(1) + '-wire').addClass(target_element.substr(1) + '-wire-' + String.fromCharCode(idx + 65)));
			$('body').append(createWire(destination_position.left, destination_position.top, destination_position.left + ((((rotor.encipher_map[(idx + (26 - rotor.ring_setting)) % 26].charCodeAt() - 65) + rotor.ring_setting) % 26) % 2 ? 10 : 25), destination_position.top).addClass(target_element.substr(1) + '-wire').addClass(target_element.substr(1) + '-wire-' + String.fromCharCode(idx + 65)));
			$('body').append(createWire(source_position.left - (idx % 2 ? 10 : 25), source_position.top, destination_position.left + ((((rotor.encipher_map[(idx + (26 - rotor.ring_setting)) % 26].charCodeAt() - 65) + rotor.ring_setting) % 26) % 2 ? 10 : 25), destination_position.top + adjustment_destination).addClass(target_element.substr(1) + '-wire').addClass(target_element.substr(1) + '-wire-' + String.fromCharCode(idx + 65)));
		}		
	}
	
	function displayRotorPositions(){
		$('.rotor-slow-display').val(String.fromCharCode(enigma.rotors[0].deflection + 65));
		$('.rotor-middle-display').val(String.fromCharCode(enigma.rotors[1].deflection + 65));
		$('.rotor-fast-display').val(String.fromCharCode(enigma.rotors[2].deflection + 65));
	}
	
	function createWire(x1, y1, x2, y2){
		var length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
		var angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
		var transform = 'rotate(' + angle + 'deg)';

		return $(document.createElement('div')).addClass('wire').css('transform', transform).width(length).offset({left: x1, top: y1});
	}	
})(jQuery);
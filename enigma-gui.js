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
			if(e.which >= 'A'.charCodeAt() && e.which <= 'Z'.charCodeAt()){
				$('.lampboard-keyboard .alphabet-set div div').each(function(idx, item){
					$(item).removeClass('hot-in');
				});				
				$('.lampboard-keyboard .alphabet-set div div').each(function(idx, item){
					$(item).removeClass('hot-out');
				});
				var slow_deflection = enigma.rotors[0].deflection;
				var middle_deflection = enigma.rotors[1].deflection;
				var result = enigma.cipher(String.fromCharCode(e.which));				
				$('.lampboard-keyboard .alphabet-' + result).addClass('hot-out');
				$('.lampboard-keyboard .alphabet-' + String.fromCharCode(e.which)).addClass('hot-in');
				
				if(slow_deflection != enigma.rotors[0].deflection){
					redrawSlowRotor();
				}
				if(middle_deflection != enigma.rotors[1].deflection){
					redrawMiddleRotor();
				}
				redrawFastRotor();
				displayRotorPositions();
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
	});
	
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
	}
	
	function makeEnigmaMachineFromSettings(){
		enigma = new EnigmaMachine(
			[
				[$('.slow-rotor-select').val(), $('.rotor-slow-display').val().charCodeAt() - 65, $('.slow-rotor-ring-setting').val().charCodeAt() - 65],
				[$('.middle-rotor-select').val(), $('.rotor-middle-display').val().charCodeAt() - 65, $('.middle-rotor-ring-setting').val().charCodeAt() - 65], 
				[$('.fast-rotor-select').val(), $('.rotor-fast-display').val().charCodeAt() - 65, $('.fast-rotor-ring-setting').val().charCodeAt() - 65]
			],
			$('.reflector-select').val(),
			['AT', 'BS']
		);	
		console.log(enigma);
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
			
			$('body').append(createWire(source_position.left, source_position.top, source_position.left - (idx % 2 ? 29 : 10), source_position.top).addClass('plugboard-wire'));
			$('body').append(createWire(destination_position.left, destination_position.top, destination_position.left + (destination_index % 2 ? 10 : 24), destination_position.top).addClass('plugboard-wire'));
			$('body').append(createWire(source_position.left - (idx % 2 ? 29 : 10), source_position.top, destination_position.left + (destination_index % 2 ? 10 : 24), destination_position.top + adjustment_destination).addClass('plugboard-wire'));
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
			
			$('body').append(createWire(source_position.left, source_position.top, source_position.left - (idx % 2 ? 29 : 10) - wire_depth * 8, source_position.top).addClass('reflector-wire'));
			$('body').append(createWire(destination_position.left, destination_position.top, destination_position.left - (destination_index % 2 ? 29 : 10) - wire_depth * 8, destination_position.top).addClass('reflector-wire'));
			$('body').append(createWire(source_position.left - (idx % 2 ? 29 : 10) - wire_depth * 8, source_position.top, destination_position.left - (destination_index % 2 ? 29 : 10) - wire_depth * 8, destination_position.top + adjustment_destination + 1).addClass('reflector-wire'));
			
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
			
			$('body').append(createWire(source_position.left, source_position.top, source_position.left - (idx % 2 ? 10 : 25), source_position.top).addClass(target_element.substr(1) + '-wire'));
			$('body').append(createWire(destination_position.left, destination_position.top, destination_position.left + ((((rotor.encipher_map[(idx + (26 - rotor.ring_setting)) % 26].charCodeAt() - 65) + rotor.ring_setting) % 26) % 2 ? 10 : 25), destination_position.top).addClass(target_element.substr(1) + '-wire'));
			$('body').append(createWire(source_position.left - (idx % 2 ? 10 : 25), source_position.top, destination_position.left + ((((rotor.encipher_map[(idx + (26 - rotor.ring_setting)) % 26].charCodeAt() - 65) + rotor.ring_setting) % 26) % 2 ? 10 : 25), destination_position.top + adjustment_destination).addClass(target_element.substr(1) + '-wire'));
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
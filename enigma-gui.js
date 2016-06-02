(function($){
	$(document).ready(function(){
		drawInterface();
		
		makeEnigmaMachineFromSettings();
	
		drawField();
		
		// Delay to allow DOM to update
		setTimeout(function(){
			drawWires();
		}, 100);
		displayRotorPositions();
		
		$('.fast-rotor-select').change(function(){
			$('.rotor-fast-wire').remove();
			makeEnigmaMachineFromSettings();
			connectFastRotorInternalWiring();
			displayRotorPositions();
		});
		$('.middle-rotor-select').change(function(){
			$('.rotor-middle-wire').remove();
			makeEnigmaMachineFromSettings();
			connectMiddleRotorInternalWiring();
			displayRotorPositions();
		});
		$('.slow-rotor-select').change(function(){
			$('.rotor-slow-wire').remove();
			makeEnigmaMachineFromSettings();
			connectSlowRotorInternalWiring();
			displayRotorPositions();
		});
		$('.reflector-select').change(function(){
			$('.reflector-wire').remove();
			makeEnigmaMachineFromSettings();
			connectReflectorInternalWiring();
			displayRotorPositions();
		});
	});
	
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
				$('.slow-rotor-select').val(), 
				$('.middle-rotor-select').val(), 
				$('.fast-rotor-select').val() 
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
		alphabet_set.append(evens.clone().addClass('alphabet-left')).append(odds.clone().addClass('alphabet-right'));
		
		$('.lampboard-keyboard').append(alphabet_set.clone());		
		$('.plugboard').append(alphabet_set.clone());
		$('.reflector').append(alphabet_set.clone().removeClass('center-block').addClass('pull-right'));		
		
		var alphabet_set_pair = $(document.createElement('div')).addClass('alphabet-set');
		alphabet_set_pair.append(evens.clone().addClass('alphabet-right'));
		alphabet_set_pair.append(odds.clone().addClass('alphabet-left'));
		var rotor = $(document.createElement('div'));
		rotor.append(alphabet_set.clone().removeClass('center-block').addClass('alphabet-pair-left'));
		rotor.append(alphabet_set_pair.clone().addClass('alphabet-pair-right'));
		
		$('.rotor-slow').append(rotor.clone());
		$('.rotor-middle').append(rotor.clone());
		$('.rotor-fast').append(rotor.clone());
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
			
			$('body').append(createWire(source_position.left, source_position.top, source_position.left - (idx % 2 ? 29 : 10) - wire_depth * 9, source_position.top).addClass('reflector-wire'));
			$('body').append(createWire(destination_position.left, destination_position.top, destination_position.left - (destination_index % 2 ? 29 : 10) - wire_depth * 9, destination_position.top).addClass('reflector-wire'));
			$('body').append(createWire(source_position.left - (idx % 2 ? 29 : 10) - wire_depth * 9, source_position.top, destination_position.left - (destination_index % 2 ? 29 : 10) - wire_depth * 9, destination_position.top + adjustment_destination + 1).addClass('reflector-wire'));
			
			wire_depth++;
			connected_letters.push(String.fromCharCode(destination_index + 65));
		}
	}
	
	function connectFastRotorInternalWiring(){
		connectRotorInternalWiring('.rotor-fast', enigma.rotors[2].encipher_map);
	}

	function connectMiddleRotorInternalWiring(){
		connectRotorInternalWiring('.rotor-middle', enigma.rotors[1].encipher_map);
	}

	function connectSlowRotorInternalWiring(){
		connectRotorInternalWiring('.rotor-slow', enigma.rotors[0].encipher_map);
	}
	
	function connectRotorInternalWiring(target_element, cipher_map){
		var adjustment_source = -2; // tweak to get lines in the right places
		var adjustment_destination = -1; // tweak to get lines in the right places
		for(var idx = 0; idx < 26; idx++){
			var source_element = $(target_element + ' .alphabet-pair-right .alphabet-' + String.fromCharCode(idx + 65));
			var destination_element = $(target_element + ' .alphabet-pair-left .alphabet-' + cipher_map[idx]);
			
			var source_letter_box_offset = source_element.offset();
			var destination_letter_box_offset = destination_element.offset();
			var source_position = {left: Math.floor(source_letter_box_offset.left - 7), top: source_letter_box_offset.top + adjustment_source + (source_element.height() / 2)};
			var destination_position = {left: Math.floor(destination_letter_box_offset.left + destination_element.width() + 7), top: destination_letter_box_offset.top + adjustment_destination + (destination_element.height() / 2)};
			
			$('body').append(createWire(source_position.left, source_position.top, source_position.left - (idx % 2 ? 10 : 25), source_position.top).addClass(target_element.substr(1) + '-wire'));
			$('body').append(createWire(destination_position.left, destination_position.top, destination_position.left + ((cipher_map[idx].charCodeAt() - 65) % 2 ? 10 : 25), destination_position.top).addClass(target_element.substr(1) + '-wire'));
			$('body').append(createWire(source_position.left - (idx % 2 ? 10 : 25), source_position.top, destination_position.left + ((cipher_map[idx].charCodeAt() - 65) % 2 ? 10 : 25), destination_position.top + adjustment_destination).addClass(target_element.substr(1) + '-wire'));
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
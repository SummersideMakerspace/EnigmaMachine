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

function EnigmaMachineGUI(){
	this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
	this.running = false;
	this.transform = this.getSupportedTransform();
	this.initialize();
}
EnigmaMachineGUI.prototype = {
	initialize: function(){
		this.enigma = new EnigmaMachine();
		
		this.drawInterface();
		this.makeEnigmaFromInterfaceSettings();
		
		this.initializeAsynchronousOperations();		
	},
	initializeAsynchronousOperations: function(){
		var that = this;

		setTimeout(function(){
			that.drawWires();
		}, 0);
		
		$('.enigma-io').keydown(function(e){
			e.preventDefault();
			
			var letter = String.fromCharCode(e.which);
			
			var ground_settings = [that.enigma.reflector_wheel.deflection];
			for(var i in that.enigma.rotors){
				ground_settings.push(that.enigma.rotors[i].deflection);
			}
			
			result = that.enigmaCipher(letter);
			$('.enigma-io').val(letter + ' -> ' + result + '  ').attr('data-last-cipher', result);
			
			if(that.enigma.reflector_wheel.deflection != ground_settings[0]){
				that.redrawReflector();
			}
			if(that.enigma.rotors.length == 4){
				if(that.enigma.rotors[0].deflection != ground_settings[1]){
					that.redrawThinRotor();
				}
			}
			if(that.enigma.rotors[(that.enigma.rotors.length == 4) ? 1 : 0].deflection != ground_settings[(that.enigma.rotors.length == 4) ? 2 : 1]){
				that.redrawSlowRotor();
			}
			if(that.enigma.rotors[(that.enigma.rotors.length == 4) ? 2 : 1].deflection != ground_settings[(that.enigma.rotors.length == 4) ? 3 : 2]){
				that.redrawMiddleRotor();
			}
			if(that.enigma.rotors[(that.enigma.rotors.length == 4) ? 3 : 2].deflection != ground_settings[(that.enigma.rotors.length == 4) ? 4 : 3]){
				that.redrawFastRotor();
			}
			that.updateGroundSettings();
			
			that.showCircuitPath(letter, result);
		});

		$('.enigma-machine-select').change(function(){
			var previous_slow_rotor = $('.slow-rotor-select').val();
			var previous_middle_rotor = $('.middle-rotor-select').val();
			var previous_fast_rotor = $('.fast-rotor-select').val();
			
			that.enigma.getMachine($('.enigma-machine-select').val());
			that.redrawInterface();
			that.makeEnigmaFromInterfaceSettings();
			that.clearWires();
			that.clearAllHotContactsAndPathTargets();
			that.drawWires();
			if(that.enigma.rotors.length == 4){
				$('.thin-rotor .contacts').parent().removeClass('text-muted');
			} else {
				$('.thin-rotor .contacts').parent().addClass('text-muted');
			}
			if(that.enigma.has_plugboard){
				$('.plugboard-settings').removeAttr('disabled');
			} else {
				$('.plugboard-settings').attr('disabled', 'disabled');
			}
			$('.enigma-io').val('');
			
			$('.slow-rotor-select option').each(function(idx, item){
				if($(item).val() == previous_slow_rotor){
					$(item).prop('selected', true);
					selected_slow_rotor = true;
				}
			});
			$('.middle-rotor-select option').each(function(idx, item){
				if($(item).val() == previous_middle_rotor){
					$(item).prop('selected', true);
					selected_middle_rotor = true;
				}
			});
			$('.fast-rotor-select option').each(function(idx, item){
				if($(item).val() == previous_fast_rotor){
					$(item).prop('selected', true);
					selected_fast_rotor = true;
				}
			});		
		});
		$('.enigma-machine-plugboard-uhr').change(function(){
			if($('.enigma-machine-plugboard-uhr').val() == 0){
				$('.plugboard-uhr-setting').attr('disabled', 'disabled').parent().removeClass('has-warning');
			} else {
				$('.plugboard-uhr-setting').removeAttr('disabled');
			}
			$('.plugboard-settings-field input').each(function(){
				$(this).val('');
			})
			that.makeEnigmaFromInterfaceSettings();
			that.redrawWiresFromEntryWheelToPlugboard();
		});
		
		$('.fast-rotor-ground-setting').change(function(){
			that.enigma.rotors[(that.enigma.rotors.length == 4) ? 3 : 2].deflection = ($('.fast-rotor-ground-setting').val()).charCodeAt() - 65;
			that.redrawFastRotor();
		});	
		$('.middle-rotor-ground-setting').change(function(){
			that.enigma.rotors[(that.enigma.rotors.length == 4) ? 2 : 1].deflection = ($('.middle-rotor-ground-setting').val()).charCodeAt() - 65;
			that.redrawMiddleRotor();
		});
		$('.slow-rotor-ground-setting').change(function(){
			that.enigma.rotors[(that.enigma.rotors.length == 4) ? 1 : 0].deflection = ($('.slow-rotor-ground-setting').val()).charCodeAt() - 65;
			that.redrawSlowRotor();
		});
		$('.thin-rotor-ground-setting').change(function(){
			that.enigma.rotors[0].deflection = ($('.thin-rotor-ground-setting').val()).charCodeAt() - 65;
			that.redrawThinRotor();
		});
		$('.reflector-ground-setting').change(function(){
			that.enigma.reflector_wheel.deflection = ($('.reflector-ground-setting').val()).charCodeAt() - 65;
			that.redrawReflector();
		});

		$('.fast-rotor-ring-setting').change(function(){
			that.enigma.rotors[(that.enigma.rotors.length == 4) ? 3 : 2].ring_setting = ($('.fast-rotor-ring-setting').val()).charCodeAt() - 65;
			that.redrawFastRotor();
		});	
		$('.middle-rotor-ring-setting').change(function(){
			that.enigma.rotors[(that.enigma.rotors.length == 4) ? 2 : 1].ring_setting = ($('.middle-rotor-ring-setting').val()).charCodeAt() - 65;
			that.redrawMiddleRotor();
		});
		$('.slow-rotor-ring-setting').change(function(){
			that.enigma.rotors[(that.enigma.rotors.length == 4) ? 1 : 0].ring_setting = ($('.slow-rotor-ring-setting').val()).charCodeAt() - 65;
			that.redrawSlowRotor();
		});
		$('.thin-rotor-ring-setting').change(function(){
			that.enigma.rotors[0].ring_setting = ($('.thin-rotor-ring-setting').val()).charCodeAt() - 65;
			that.redrawThinRotor();
		});	

		$('.reflector-select').change(function(){
			var redraw_thin_rotor_wires = false;
			if($('.reflector-select').val() == 'D'){
				if(that.enigma.machine_version == 'M4'){
					redraw_thin_rotor_wires = true;
					$('.thin-rotor-select').attr('disabled', 'disabled');
					$('.thin-rotor-ring-setting').attr('disabled', 'disabled');
					$('.thin-rotor-ground-setting').attr('disabled', 'disabled');
					$('.thin-rotor .contacts').parent().addClass('text-muted');
					$('.thin-rotor-wire').remove();
				}
				$('.ukw-d-settings').show().parent().parent().addClass('input-group');
			} else {
				if(that.enigma.machine_version == 'M4'){
					redraw_thin_rotor_wires = true;
					$('.thin-rotor-select').removeAttr('disabled');
					$('.thin-rotor-ring-setting').removeAttr('disabled');
					$('.thin-rotor-ground-setting').removeAttr('disabled');
					$('.thin-rotor .contacts').parent().removeClass('text-muted');
				}				
				$('.ukw-d-settings').hide().parent().parent().removeClass('input-group');
			}
			that.makeEnigmaFromInterfaceSettings();
			that.redrawReflector();
			if(redraw_thin_rotor_wires){
				that.drawWiresThinRotor();
			}
		});
		$('.thin-rotor-select').change(function(){
			that.makeEnigmaFromInterfaceSettings();
			that.redrawThinRotor();
			that.allRotorsUnique();
		});
		$('.slow-rotor-select').change(function(){
			that.makeEnigmaFromInterfaceSettings();
			that.redrawSlowRotor();
			that.allRotorsUnique();
		});
		$('.middle-rotor-select').change(function(){
			that.makeEnigmaFromInterfaceSettings();
			that.redrawMiddleRotor();
			that.allRotorsUnique();
		});
		$('.fast-rotor-select').change(function(){
			that.makeEnigmaFromInterfaceSettings();
			that.redrawFastRotor();
			that.allRotorsUnique();
		});
		
		$('.plugboard-settings-field input').keydown(function(e){
			e.preventDefault();
			if($('.enigma-machine-plugboard-uhr').val() == '1'){
				if(e.which == 8 || e.which == 46){
					var paired = ($(this).val()[0] == 'A') ? 'B' : 'A';
					paired += $(this).val()[1];
					$('.plugboard-settings-field input').each(function(idx, item){
						if($(item).val() == paired){
							$(item).parent().addClass('has-warning');
						}
					});					
					$(this).val('').parent().removeClass('has-warning');
					that.makeEnigmaFromInterfaceSettings();
					that.redrawWiresFromEntryWheelToPlugboard();					
				}				
				if(!(e.which == 65 || e.which == 66 || (e.which >= '0'.charCodeAt() && e.which <= '9'.charCodeAt()))){
					return;
				}
				if(e.which == 65 || e.which == 66){
					$(this).val(String.fromCharCode(e.which));
				} else {
					if($(this).val().length == 0){
						return;
					}
					if($(this).val().length < 2){
						var $that = $(this);
						var connected_plug_count = 0;
						var paired = ($(this).val() == 'A') ? 'B' : 'A';
						paired += String.fromCharCode(e.which);
						var found_pair = false;
						$('.plugboard-settings-field input').each(function(idx, item){
							if($(item).val() == paired){
								$(item).parent().removeClass('has-warning');
								found_pair = true;
							}
							if($(item).val() != ''){
								connected_plug_count++;
							}
							if($(item).val() == $that.val() + String.fromCharCode(e.which)){
								$(item).val('');
								$(item).parent().removeClass('has-warning');
							}
						});
						$(this).val($(this).val() + String.fromCharCode(e.which));
						if(connected_plug_count < 20){
							$('.plugboard-uhr-setting').parent().addClass('has-warning');
						} else {
							$('.plugboard-uhr-setting').parent().removeClass('has-warning');
						}
						if(!found_pair){
							$(this).parent().addClass('has-warning');
						} else {
							$(this).parent().removeClass('has-warning');
						}
					}
					that.makeEnigmaFromInterfaceSettings();				
					that.redrawWiresFromEntryWheelToPlugboard();					
				}
			} else {
				if(e.which == 8 || e.which == 46){
					$('.plugboard-setting-' + $(this).val()).val('');
					$(this).val('');
					that.makeEnigmaFromInterfaceSettings();
					that.redrawWiresFromEntryWheelToPlugboard();					
				}
				if(e.which < 'A'.charCodeAt() || e.which > 'Z'.charCodeAt()){
					return;
				}
				if($(this).attr('data-letter') == String.fromCharCode(e.which)){
					return;
				}
				var $that = $(this);
				$('.plugboard-settings-field input').each(function(idx, item){
					if($(item).val().charCodeAt() == e.which){
						$(item).val('');
					}
					if($that.attr('data-letter') == $(item).val()){
						$(item).val('');
					}
				});			
				$(this).val(String.fromCharCode(e.which));			
				$('.plugboard-setting-' + String.fromCharCode(e.which)).val($(this).attr('data-letter'));
				that.makeEnigmaFromInterfaceSettings();
				that.redrawWiresFromEntryWheelToPlugboard();				
			}
		});
		$('.plugboard-settings-field input').blur(function(e){
			if($('.enigma-machine-plugboard-uhr').val() == '1'){
				if($(this).val().length == 1){
					$(this).parent().removeClass('has-warning');
					$(this).val('');
				}
			}
		});
		$('.plugboard-uhr-setting').change(function(){
			that.makeEnigmaFromInterfaceSettings();
			that.redrawWiresFromEntryWheelToPlugboard();			
		});
		
		$('.ukw-d-settings-field input').keydown(function(e){
			e.preventDefault();
			if(e.which == 8 || e.which == 46){
				$('.ukw-d-setting-' + $(this).val()).val('').parent().addClass('has-warning');
				$(this).val('').parent().addClass('has-warning');
				that.makeEnigmaFromInterfaceSettings();
				that.redrawWiresReflector();					
			}			
			if(e.which < 'A'.charCodeAt() || e.which > 'Z'.charCodeAt()){
				return;
			}		
			if(e.which == 'J'.charCodeAt() || e.which == 'Y'.charCodeAt()){
				return;
			}				
			if($(this).attr('data-letter') == String.fromCharCode(e.which)){
				return;
			}	
			var $that = $(this);
			$('.ukw-d-settings-field input').each(function(idx, item){
				if($(item).val().charCodeAt() == e.which){
					$(item).val('').parent().addClass('has-warning');
				}
				if($that.attr('data-letter') == $(item).val()){
					$(item).val('').parent().addClass('has-warning');
				}
				if($(item).val() == ''){
					$(item).parent().addClass('has-warning');
				} else {
					$(item).parent().removeClass('has-warning');
				}
			});			
			$(this).val(String.fromCharCode(e.which)).parent().removeClass('has-warning');
			$('.ukw-d-setting-' + String.fromCharCode(e.which)).val($(this).attr('data-letter')).parent().removeClass('has-warning');
			that.makeEnigmaFromInterfaceSettings();
			that.redrawWiresReflector();
		});
		
		$('.enigma-step').click(function(){
			if($('.bulk-text-input').val().length == 0){
				return;
			}
			var letter = $('.bulk-text-input').val()[0].toUpperCase();
			$('.bulk-text-input').val($('.bulk-text-input').val().substr(1));
			if(letter == ' '){
				$('.bulk-text-output').append(' ');
				return $('.enigma-step').click();
			}
			if(letter.charCodeAt() < 'A'.charCodeAt() || letter.charCodeAt() > 'Z'.charCodeAt()){
				return $('.enigma-step').click();
			}
			$('.enigma-io').trigger({type: 'keydown', which: letter.charCodeAt(), keyCode: letter.charCodeAt()});
			if($('.bulk-text-output').text() == 'Ciphertext output'){
				$('.bulk-text-output').text('');
			}
			$('.bulk-text-output').append($('.enigma-io').attr('data-last-cipher'));
		});
		$('.bulk-text-output-clear').click(function(){
			$('.bulk-text-output').text('Ciphertext output');
		});
		$('.enigma-all').click(function(){
			if($('.bulk-text-input').val().length == 0){
				return;
			}
			$('.bulk-text-output').empty().append(that.enigma.cipher($('.bulk-text-input').val().toUpperCase()));
			$('.bulk-text-input').val('');
			that.updateGroundSettings();
		});
		$('.enigma-play').click(function(){
			if(that.running){
				that.running = false;
				return;
			}
			if($('.bulk-text-input').val().length == 0){
				return;
			}
			$('.bulk-text-output').text('');				
			that.running = true;
			$('.enigma-play').addClass('active').text('Stop');
			that.enigmaPlay();
		});
		$('.enigma-play-x2').click(function(){
			if($('.enigma-play-x2').hasClass('active')){
				$('.enigma-play-x2').removeClass('active');
			} else {
				$('.enigma-play-x10').removeClass('active');				
				$('.enigma-play-x2').addClass('active');			
			}
		});
		$('.enigma-play-x10').click(function(){
			if($('.enigma-play-x10').hasClass('active')){
				$('.enigma-play-x10').removeClass('active');
			} else {
				$('.enigma-play-x2').removeClass('active');
				$('.enigma-play-x10').addClass('active');			
			}
		});
	},
	toAlphabet: function(position){
		return this.alphabet[position % 26];
	},
	drawInterface: function(){
		var html = '';
		for(var i in this.enigma.machines){
			html += '<option value="' + i + '"' + (i == 'M4' ? ' selected="selected"' : '') + '>' + this.enigma.machines[i].label + '</option>'
		}
		$('.enigma-machine-select').append(html);
		$('.enigma-machine-step-mechanism').attr('disabled', 'disabled').append($(document.createElement('option')).val('ratchet').append('Ratchets').prop('selected', true));
		$('.enigma-machine-step-mechanism').append($(document.createElement('option')).val('cog').append('Cogs'));
		$('.enigma-machine-plugboard-available').attr('disabled', 'disabled').append($(document.createElement('option')).val('0').append('No'));
		$('.enigma-machine-plugboard-available').append($(document.createElement('option')).val('1').append('Yes').prop('selected', true));
		$('.enigma-machine-plugboard-uhr').append($(document.createElement('option')).val('0').append('No').prop('selected', true));
		$('.enigma-machine-plugboard-uhr').append($(document.createElement('option')).val('1').append('Yes'));
		this.drawPlugboardInterface();
		this.drawReflectorInterface();
		this.drawRotorInterfaces();
		this.drawWirePathTargets();
		this.drawContacts();		
	},
	redrawInterface: function(){
		if(this.enigma.cog_stepping){
			$($('.enigma-machine-step-mechanism option')[0]).removeAttr('selected');
			$($('.enigma-machine-step-mechanism option')[1]).prop('selected', true);	
		} else {			
			$($('.enigma-machine-step-mechanism option')[0]).prop('selected', true);
			$($('.enigma-machine-step-mechanism option')[1]).removeAttr('selected');				
		}
		if(this.enigma.has_plugboard){
			$($('.enigma-machine-plugboard-available option')[0]).removeAttr('selected');
			$($('.enigma-machine-plugboard-available option')[1]).prop('selected', true);
			$('.enigma-machine-plugboard-uhr').removeAttr('disabled');		
		} else {
			$($('.enigma-machine-plugboard-available option')[0]).prop('selected', true);
			$($('.enigma-machine-plugboard-available option')[1]).removeAttr('selected');		
			$($('.enigma-machine-plugboard-uhr option')[0]).prop('selected', true);			
			$($('.enigma-machine-plugboard-uhr option')[1]).removeAttr('selected');			
			$('.enigma-machine-plugboard-uhr').attr('disabled', 'disabled');			
		}
		this.redrawReflectorInterface();
		this.redrawRotorInterfaces();
		this.redrawEntryWheelAndPlugboard();
	},	
	drawPlugboardInterface: function(){
		var html = '<div class="row">';
		for(var idx = 0; idx < 3; idx++){
			html += '<div class="col-xs-4">';
			for(var idy = 0; idy < 9; idy++){
				if((idx * 9 + idy) == 26){
					html += '<div class="input-group"><div class="input-group-addon">Uhr</div>'
						+ '<select class="plugboard-uhr-setting form-control" disabled="disabled">';
					
					for(var idz = 0; idz < 40; idz++){
						html += '<option value="' + idz + '">' + idz + '</option>';
					}
					
					html += '</select></div>';
					break;
				}				
				var letter = this.alphabet[idx * 9 + idy];
				html += '<div class="input-group"><div class="input-group-addon">' 
					+ letter
					+ '</div><input type="text" class="form-control plugboard-setting-' 
					+ letter
					+ '" data-letter="' 
					+ letter 
					+ '"></div>';
			}
			html += '</div>';
		}
		html += '</row>'

		$('.plugboard-settings-field').append(html);				
	},
	drawReflectorInterface: function(){
		var html = '';
		for(var i in this.alphabet){
			html += '<option value="' + this.alphabet[i] + '">' + this.alphabet[i] + '</option>';
		}
		
		$('.reflector-ground-setting').append(html);

		$('.ukw-d-settings').hide().parent().parent().removeClass('input-group');
		
		var html = '<div class="row">';
		for(var idx = 0; idx < 3; idx++){
			html += '<div class="col-xs-4">';
			for(var idy = 0; idy < 9; idy++){
				if((idx * 9 + idy) == 26){
					break;
				}		
				var letter = this.alphabet[idx * 9 + idy];
				html += '<div class="input-group"><div class="input-group-addon">' 
					+ letter
					+ '</div><input type="text" class="form-control ukw-d-setting-' 
					+ letter
					+ '" data-letter="' 
					+ letter 
					+ '" value="' + this.enigma.machines.I.reflectors.D[idx * 9 + idy] + '"></div>';
			}
			html += '</div>';
		}
		html += '</row>'	
		$('.ukw-d-settings-field').append(html);
		
		$('.ukw-d-setting-J').attr('disabled', 'disabled');
		$('.ukw-d-setting-Y').attr('disabled', 'disabled');
		
		this.redrawReflectorInterface();
	},
	redrawReflectorInterface: function(){
		var previous_reflector = $('.reflector-select').val();
		$('.reflector-select').empty();

		for(var i in this.enigma.available_reflectors){
			$('.reflector-select').append('<option value="' + i + '">' + i + '</option>');
		}
		if($('.reflector-select option').length == 1){
			$('.reflector-select').attr('disabled', 'disabled');
			$('.ukw-d-settings').hide().parent().parent().removeClass('input-group');
		} else {
			$('.reflector-select option').each(function(idx, item){
				if($(item).val() == previous_reflector){
					$(item).prop('selected', true);
				}
			});
			if($('.reflector-select').val() != 'D'){
				$('.ukw-d-settings').hide().parent().parent().removeClass('input-group');
			}
			$('.reflector-select').removeAttr('disabled');
		}

		if(this.enigma.cog_stepping){
			$('.reflector-ground-setting').removeAttr('disabled');	
		} else {
			$('.reflector-ground-setting').val('A').trigger('change');
			$('.reflector-ground-setting').attr('disabled', 'disabled');		
		}
	},
	drawRotorInterfaces: function(){
		var html = '';
		for(var i in this.alphabet){
			html += '<option value="' + this.alphabet[i] + '">' + this.alphabet[i] + '</option>';
		}
		$('.thin-rotor-ring-setting').append(html);
		$('.slow-rotor-ring-setting').append(html);
		$('.middle-rotor-ring-setting').append(html);
		$('.fast-rotor-ring-setting').append(html);
		$('.thin-rotor-ground-setting').append(html);
		$('.slow-rotor-ground-setting').append(html);
		$('.middle-rotor-ground-setting').append(html);
		$('.fast-rotor-ground-setting').append(html);		
		
		this.redrawRotorInterfaces();
	},
	redrawRotorInterfaces: function(){
		$('.thin-rotor-select').empty();
		$('.slow-rotor-select').empty();
		$('.middle-rotor-select').empty();
		$('.fast-rotor-select').empty();
		
		var thin_rotor_set = [];
		var rotor_set = [];

		for(var i in this.enigma.available_rotors){
			if(this.enigma.available_rotors[i].thin_rotor){
				thin_rotor_set.push(i);
			} else {
				rotor_set.push(i);
			}
		}
		thin_rotor_set.sort(function(a, b){
			if(a < b){
				return -1;
			}
			if(a > b){
				return 1;
			}
			return 0;
		});
		rotor_set.sort(function(a, b){
			if(a < b){
				return -1;
			}
			if(a > b){
				return 1;
			}
			return 0;
		});
		
		var html = '';
		for(var i in rotor_set){
			html += '<option value="' + rotor_set[i] + '">' + rotor_set[i] + '</option>';
		}		
		$('.slow-rotor-select').append(html);
		$('.middle-rotor-select').append(html);
		$('.fast-rotor-select').append(html);
	
		$($('.slow-rotor-select option')[0]).prop('selected', true);
		$($('.middle-rotor-select option')[1]).prop('selected', true);
		$($('.fast-rotor-select option')[2]).prop('selected', true);


		if(thin_rotor_set.length == 0){
			$('.thin-rotor-select').attr('disabled', 'disabled');
			$('.thin-rotor-ring-setting').attr('disabled', 'disabled');
			$('.thin-rotor-ground-setting').attr('disabled', 'disabled');
		} else {
			var html = '';
			for(var i in thin_rotor_set){
				html += '<option value="' + thin_rotor_set[i] + '">' + thin_rotor_set[i] + '</option>';
			}
			$('.thin-rotor-select').append(html);			
			$('.thin-rotor-select').removeAttr('disabled');
			$('.thin-rotor-ring-setting').removeAttr('disabled');
			$('.thin-rotor-ground-setting').removeAttr('disabled');			
		}		
	},
	drawWirePathTargets: function(){
		var html = '<div class="center-block wire-path-targets">';
		for(var idx = 0; idx < 26; idx++){
			html += '<div class="alphabet-' + this.alphabet[idx] + '">- ' + this.alphabet[idx] + ' -</div>';
		}
		html += '</div>';
		$('.thin-rotor').append(html);
		$('.slow-rotor').append(html);
		$('.middle-rotor').append(html);
		$('.fast-rotor').append(html);		
	},
	drawContacts: function(){
		var html = '<div class="center-block contacts"><div class="alphabet-evens alphabet-left">';
		for(var idx = 0; idx < 26; idx += 2){
			html += '<div class="alphabet-' + this.alphabet[idx] + '">' + this.alphabet[idx] + '</div>';
		}
		html += '</div><div class="alphabet-odds alphabet-right alphabet-offset">';
		for(var idx = 1; idx < 26; idx += 2){
			html += '<div class="alphabet-' + this.alphabet[idx] + '">' + this.alphabet[idx] + '</div>';
		}
		html += '</div>';
				
		$('.reflector').append(html);
		$('.reflector .contacts').addClass('pull-right').removeClass('center-block');
		
		var contacts = this.createRotorContacts({deflection: 0, ring_setting: 0});
		$('.thin-rotor').append(contacts);
		$('.slow-rotor').append(contacts);
		$('.middle-rotor').append(contacts);		
		$('.fast-rotor').append(contacts);	
		
		this.redrawEntryWheelAndPlugboard();
	},
	createRotorContacts: function(rotor){
		var html = '<div class="rotor-field"><div class="alphabet-pair-left contacts">';
		var evens = '<div class="alphabet-evens alphabet-left' + (rotor.deflection % 2 ? ' alphabet-offset' : '' ) + '">';
		for(var idx = 0; idx < 13; idx++){
			evens += '<div class="alphabet-' + this.toAlphabet(((idx + Math.ceil(rotor.deflection / 2)) * 2)) + '">' + this.toAlphabet(((idx + Math.ceil(rotor.deflection / 2)) * 2)) + '</div>';
		}
		evens += '</div>';
		var odds = '<div class="alphabet-odds alphabet-right' + (rotor.deflection % 2 ? '' : ' alphabet-offset' ) + '">';
		for(var idx = 0; idx < 13; idx++){
			odds += '<div class="alphabet-' + this.toAlphabet(((idx + Math.floor(rotor.deflection / 2)) * 2 + 1)) + '">' + this.toAlphabet(((idx + Math.floor(rotor.deflection / 2)) * 2 + 1)) + '</div>';
		}
		odds += '</div>';

		html += evens + odds + '</div><div class="alphabet-pair-right contacts">' 
			+ evens.replace('alphabet-left', 'alphabet-right')
			+ odds.replace('alphabet-right', 'alphabet-left')
			+ '</div></div>';

		return html.replace('alphabet-' + this.alphabet[rotor.ring_setting], 'alphabet-' + this.alphabet[rotor.ring_setting] + ' alphabet-ring-setting');				
	},	
	redrawEntryWheelAndPlugboard: function(){
		$('.entry-wheel .contacts').remove();
		$('.plugboard .contacts').remove();
		
		var html = '<div class="center-block contacts"><div class="alphabet-evens alphabet-left">';
		for(var idx = 0; idx < 26; idx += 2){
			html += '<div class="alphabet-' + this.enigma.entry_wheel.wire_map[idx] + '">' + this.enigma.entry_wheel.wire_map[idx] + '</div>';
		}
		html += '</div><div class="alphabet-odds alphabet-right alphabet-offset">';
		for(var idx = 1; idx < 26; idx += 2){
			html += '<div class="alphabet-' + this.enigma.entry_wheel.wire_map[idx] + '">' + this.enigma.entry_wheel.wire_map[idx] + '</div>';
		}		
		$('.entry-wheel').append(html);	
		$('.plugboard').append(html);	
	},
	redrawReflector: function(){
		$('.reflector .contacts').remove();
		$('.reflector-wire').remove();
		
		var html = '<div class="pull-right contacts"><div class="alphabet-evens alphabet-left' + (this.enigma.reflector_wheel.deflection % 2 ? ' alphabet-offset' : '') + '">';
		for(var idx = 0; idx < 13; idx++){
			html += '<div class="alphabet-' + this.toAlphabet(((idx + Math.ceil(this.enigma.reflector_wheel.deflection / 2)) * 2)) + '">' + this.toAlphabet(((idx + Math.ceil(this.enigma.reflector_wheel.deflection / 2)) * 2)) + '</div>';
		}
		html += '</div><div class="alphabet-odds alphabet-right' + (this.enigma.reflector_wheel.deflection % 2 ? '' : ' alphabet-offset' ) + '">';
		for(var idx = 0; idx < 13; idx++){
			html += '<div class="alphabet-' + this.toAlphabet(((idx + Math.floor(this.enigma.reflector_wheel.deflection / 2)) * 2 + 1)) + '">' + this.toAlphabet(((idx + Math.floor(this.enigma.reflector_wheel.deflection / 2)) * 2 + 1)) + '</div>';
		}
		
		$('.reflector').append(html);
		
		this.drawWiresReflector();
	},
	redrawThinRotor: function(){
		$('.thin-rotor .rotor-field').remove();
		$('.thin-rotor-wire').remove();
		$('.thin-rotor').append(this.createRotorContacts(this.enigma.rotors[0]));
		this.drawWiresThinRotor();
	},
	redrawSlowRotor: function(){
		$('.slow-rotor .rotor-field').remove();
		$('.slow-rotor-wire').remove();
		$('.slow-rotor').append(this.createRotorContacts(this.enigma.rotors[(this.enigma.rotors.length == 4) ? 1 : 0]));
		this.drawWiresSlowRotor();
	},
	redrawMiddleRotor: function(){
		$('.middle-rotor .rotor-field').remove();
		$('.middle-rotor-wire').remove();
		$('.middle-rotor').append(this.createRotorContacts(this.enigma.rotors[(this.enigma.rotors.length == 4) ? 2 : 1]));
		this.drawWiresMiddleRotor();		
	},
	redrawFastRotor: function(){
		$('.fast-rotor .rotor-field').remove();
		$('.fast-rotor-wire').remove();
		$('.fast-rotor').append(this.createRotorContacts(this.enigma.rotors[(this.enigma.rotors.length == 4) ? 3 : 2]));
		this.drawWiresFastRotor();		
	},
	makeEnigmaFromInterfaceSettings: function(){
		var rotors = [];
		
		if($('.thin-rotor-select option').length > 0){
			rotors.push([$('.thin-rotor-select').val(), $('.thin-rotor-ground-setting').val().charCodeAt() - 65, $('.thin-rotor-ring-setting').val().charCodeAt() - 65]);
		}
		rotors.push([$('.slow-rotor-select').val(), $('.slow-rotor-ground-setting').val().charCodeAt() - 65, $('.slow-rotor-ring-setting').val().charCodeAt() - 65]);
		rotors.push([$('.middle-rotor-select').val(), $('.middle-rotor-ground-setting').val().charCodeAt() - 65, $('.middle-rotor-ring-setting').val().charCodeAt() - 65]);
		rotors.push([$('.fast-rotor-select').val(), $('.fast-rotor-ground-setting').val().charCodeAt() - 65, $('.fast-rotor-ring-setting').val().charCodeAt() - 65]);
		
		var plugboard_connected = [];
		var plugboard = [];
		if($('.enigma-machine-plugboard-uhr').val() == '1'){
			$('.plugboard-settings-field input').each(function(){
				if($(this).val().length == 2 && $(this).val()[0] == 'A'){
					var $that = $(this);
					$('.plugboard-settings-field input').each(function(idx, item){
						if($(item).val() == 'B' + $that.val()[1]){
							plugboard.push($that.attr('data-letter') + $(item).attr('data-letter'));		
						}
						if($(item).attr('data-letter') != $that.attr('data-letter') && $(item).val() == $that.val()){
							$(item).val('');
						}
					});
				}
			});			
		} else {
			$('.plugboard-settings-field input').each(function(){
				if(plugboard_connected.indexOf($(this).attr('data-letter')) > -1){
					return;
				}
				if($(this).val().length > 0){
					plugboard.push($(this).attr('data-letter') + $(this).val());
					plugboard_connected.push($(this).attr('data-letter'));
				}
			});
		};
		
		this.enigma = new EnigmaMachine(
			$('.enigma-machine-select').val(), 
			rotors,
			[
				$('.reflector-select').val(),
				$('.reflector-ground-setting').val().charCodeAt() - 65
			],
			plugboard,
			$('.enigma-machine-plugboard-uhr').val() == '1' ? $('.plugboard-uhr-setting').val() : false
		);
		
		if($('.reflector-select').val() == 'D'){
			for(var idx = 0; idx < 26; idx++){
				this.enigma.reflector_wheel.cipher_map[idx] = $('.ukw-d-setting-' + this.alphabet[idx]).val();
			}
		}
	},
	drawWires: function(){
		this.drawWiresReflector();
		this.drawWiresThinRotor();
		this.drawWiresSlowRotor();
		this.drawWiresMiddleRotor();
		this.drawWiresFastRotor();
		this.drawWiresFromEntryWheelToPlugboard();		
	},
	drawWiresReflector: function(){
		var adjustment_source = -2; // tweak to get lines in the right places
		var adjustment_destination = -1; // tweak to get lines in the right places	
		var connected_letters = [];
		var wire_depth = 1;
				
		var html = '';
		for(var idx = 0; idx < 26; idx++){
			var source_letter = this.alphabet[idx];
			
			if(connected_letters.indexOf(source_letter) > -1){
				continue;
			}
			
			var extra_css_class_string_suffix = 'reflector-wire reflector-wire-';			
			
			var source_element = $('.reflector .alphabet-' + source_letter);			
			var source_position = {
				left: Math.floor(source_element.position().left - 7),
				top: source_element.position().top + adjustment_source + (source_element.height() / 2)
			};			
			
			if(this.enigma.reflector_wheel.cipher_map[idx] == ''){
				html += this.createWire(
					source_position.left,
					source_position.top,
					source_position.left - (idx % 2 ? 29 : 10),
					source_position.top,
					extra_css_class_string_suffix + 'in-' + source_letter
				);				
				html += this.createWire(
					source_position.left - (idx % 2 ? 29 : 10) + (source_element.height() / 4),
					source_position.top + (source_element.height() / 5),
					source_position.left - (idx % 2 ? 29 : 10) - (source_element.height() / 5),
					source_position.top - (source_element.height() / 4),
					extra_css_class_string_suffix + 'in-' + source_letter
				);
				html += this.createWire(
					source_position.left - (idx % 2 ? 29 : 10) - (source_element.height() / 4),
					source_position.top + (source_element.height() / 5),
					source_position.left - (idx % 2 ? 29 : 10) + (source_element.height() / 5),
					source_position.top - (source_element.height() / 4),
					extra_css_class_string_suffix + 'in-' + source_letter
				);				
			} else {
				var destination_idx = this.enigma.reflector_wheel.cipher_map[idx].charCodeAt() - 65;			
				var destination_element = $('.reflector .alphabet-' + this.enigma.reflector_wheel.cipher_map[idx]);
				var destination_position = {
					left: Math.floor(destination_element.position().left - 7),
					top: destination_element.position().top + adjustment_destination + (destination_element.height() / 2)
				};
				
				html += this.createWire(
					source_position.left,
					source_position.top,
					source_position.left - (idx % 2 ? 29 : 10) - wire_depth * 8,
					source_position.top,
					extra_css_class_string_suffix + 'in-' + source_letter
				);				
				html += this.createWire(
					destination_position.left,
					destination_position.top,
					destination_position.left - (destination_idx % 2 ? 29 : 10) - wire_depth * 8,
					destination_position.top,
					extra_css_class_string_suffix + 'out-' + source_letter
				);
				html += this.createWire(
					source_position.left - (idx % 2 ? 29 : 10) - wire_depth * 8,
					source_position.top,
					destination_position.left - (destination_idx % 2 ? 29 : 10) - wire_depth * 8,
					destination_position.top + adjustment_destination + 1,
					extra_css_class_string_suffix + 'middle-' + source_letter
				);
				
				connected_letters.push(this.enigma.reflector_wheel.cipher_map[idx]);
			}
			wire_depth++;			
		}
		
		$('.reflector').append(html);
	},
	drawWiresThinRotor: function(){
		if(this.enigma.rotors.length == 4){
			this.drawWiresRotor('.thin-rotor', this.enigma.rotors[0]);
		}
	},
	drawWiresSlowRotor: function(){
		this.drawWiresRotor('.slow-rotor', this.enigma.rotors[(this.enigma.rotors.length == 3) ? 0 : 1]);
	},
	drawWiresMiddleRotor: function(){
		this.drawWiresRotor('.middle-rotor', this.enigma.rotors[(this.enigma.rotors.length == 3) ? 1 : 2]);
	},
	drawWiresFastRotor: function(){
		this.drawWiresRotor('.fast-rotor', this.enigma.rotors[(this.enigma.rotors.length == 3) ? 2 : 3]);
	},
	drawWiresRotor: function(target_element, rotor){
		var adjustment_source = -2; // tweak to get lines in the right places
		var adjustment_destination = -1; // tweak to get lines in the right places
		
		var html = '';
		for(var idx = 0; idx < 26; idx++){
			var source_letter = this.alphabet[idx];
			
			var destination_idx = ((
				rotor.encipher_map[
					(idx + (26 - rotor.ring_setting)) % 26
				].charCodeAt() - 65
			) + rotor.ring_setting) % 26;
			
			var source_element = $(target_element + ' .alphabet-pair-right .alphabet-' + source_letter);
			var destination_element = $(target_element + ' .alphabet-pair-left .alphabet-' + String.fromCharCode(destination_idx + 65));
			
			var source_position = {
				left: Math.floor(source_element.position().left - 7),
				top: source_element.position().top + adjustment_source + (source_element.height() / 2)
			};
			var destination_position = {
				left: Math.floor(destination_element.position().left + destination_element.width() + 7),
				top: destination_element.position().top + adjustment_destination + (destination_element.height() / 2)
			};

			var extra_css_class_string = target_element.substr(1) + '-wire ' + target_element.substr(1) + '-wire-' + source_letter;
			
			html += this.createWire(
				source_position.left,
				source_position.top,
				source_position.left - (idx % 2 ? 10 : 25),
				source_position.top,
				extra_css_class_string
			);
			html += this.createWire(
				destination_position.left,
				destination_position.top,
				destination_position.left + (destination_idx % 2 ? 10 : 25),
				destination_position.top,
				extra_css_class_string
			);
			html += this.createWire(
				source_position.left - (idx % 2 ? 10 : 25),
				source_position.top,
				destination_position.left + (destination_idx % 2 ? 10 : 25),
				destination_position.top + adjustment_destination,
				extra_css_class_string
			);
		}
		
		$(target_element).append(html);		
	},
	drawWiresFromEntryWheelToPlugboard: function(){
		var adjustment_source = -2; // tweak to get lines in the right places
		var adjustment_destination = -1; // tweak to get lines in the right places
		
		var html = '';
		for(var idx = 0; idx < 26; idx++){
			var source_letter = this.alphabet[idx];
			
			var source_element = $('.entry-wheel .alphabet-' + source_letter);
			
			var source_position = {
				left: Math.floor(source_element.position().left - 7),
				top: source_element.position().top + adjustment_source + (source_element.height() / 2)
			};
			
			var extra_css_class_string = 'plugboard-wire plugboard-wire-' + source_letter;
			
			html += this.createWire(
				source_position.left,
				source_position.top,
				source_position.left - (idx % 2 ? 29 : 10),
				source_position.top,
				extra_css_class_string
			);
			
			if(this.enigma.plugboard.translate(source_letter) == ''){
				html += this.createWire(
					source_position.left - (idx % 2 ? 29 : 10) + (source_element.height() / 4),
					source_position.top + (source_element.height() / 5),
					source_position.left - (idx % 2 ? 29 : 10) - (source_element.height() / 5),
					source_position.top - (source_element.height() / 4),
					extra_css_class_string
				);
				html += this.createWire(
					source_position.left - (idx % 2 ? 29 : 10) - (source_element.height() / 4),
					source_position.top + (source_element.height() / 5),
					source_position.left - (idx % 2 ? 29 : 10) + (source_element.height() / 5),
					source_position.top - (source_element.height() / 4),
					extra_css_class_string
				);
			} else {
				var destination_element = $('.plugboard .alphabet-' + this.enigma.plugboard.translate(source_letter));
				var destination_index = this.enigma.plugboard.translate(source_letter).charCodeAt() - 65;
				var destination_position = {
					left: destination_element.width() + 7 + destination_element.position().left 
							- (
								source_element.offsetParent().offset().left 
								- destination_element.offsetParent().offset().left
							),
					top: destination_element.position().top + adjustment_destination + (destination_element.height() / 2)
				};
				
				html += this.createWire(
					destination_position.left,
					destination_position.top,
					destination_position.left + (destination_index % 2 ? 10 : 25),
					destination_position.top,
					extra_css_class_string
				);
				html += this.createWire(
					source_position.left - (idx % 2 ? 29 : 10),
					source_position.top,
					destination_position.left + (destination_index % 2 ? 10 : 24),
					destination_position.top + adjustment_destination,
					extra_css_class_string
				);
			}
		}
			
		$('.entry-wheel').append(html);
	},
	redrawWiresFromEntryWheelToPlugboard: function(){
		$('.entry-wheel .wire').remove();
		this.drawWiresFromEntryWheelToPlugboard();			
	},
	redrawWiresReflector: function(){
		$('.reflector .wire').remove();
		this.drawWiresReflector();
	},
	createWire: function(x1, y1, x2, y2, extra_css_class_string){
		if(undefined == extra_css_class_string){
			extra_css_class_string = '';
		}
		var length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
		var angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
		var transform = 'rotate(' + angle + 'deg)';

		return '<div class="wire ' + extra_css_class_string 
			+ '" style="' + this.transform + ':rotate(' + angle + 'deg);width:' + length + 'px;left:' + x1 + 'px;top:' + y1 + 'px"></div>';
	},
	getSupportedTransform: function(){
		var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
		var css = 'transform -webkit-transform -moz-transform -o-transform -ms-transform'.split(' ');
		var div = document.createElement('div');
		for(var i = 0; i < prefixes.length; i++) {
			if(div && div.style[prefixes[i]] !== undefined) {
				return css[i];
			}
		}
		return false;	
	},
	enigmaCipher: function(letter){
		return this.enigma.cipher(letter);
	},
	clearWires: function(){
		$('.wire').remove();
	},
	updateGroundSettings: function(){
		if(this.enigma.cog_stepping){
			$('.reflector-ground-setting').val(this.alphabet[this.enigma.reflector_wheel.deflection]);
		}		
		if(this.enigma.rotors.length == 4){
			$('.thin-rotor-ground-setting').val(this.alphabet[this.enigma.rotors[0].deflection]);
		}
		$('.slow-rotor-ground-setting').val(this.alphabet[this.enigma.rotors[(this.enigma.rotors.length == 4) ? 1 : 0].deflection]);
		$('.middle-rotor-ground-setting').val(this.alphabet[this.enigma.rotors[(this.enigma.rotors.length == 4) ? 2 : 1].deflection]);
		$('.fast-rotor-ground-setting').val(this.alphabet[this.enigma.rotors[(this.enigma.rotors.length == 4) ? 3 : 2].deflection]);
	},
	allRotorsUnique: function(){
		$('.slow-rotor-select').parent().removeClass('bg-warning');
		$('.middle-rotor-select').parent().removeClass('bg-warning');
		$('.fast-rotor-select').parent().removeClass('bg-warning');
		var slow = $('.slow-rotor-select option:selected').val();
		var middle = $('.middle-rotor-select option:selected').val();
		var fast = $('.fast-rotor-select option:selected').val();
		if(slow == middle || slow == fast){
			$('.slow-rotor-select').parent().addClass('bg-warning');
		}
		if(middle == slow || middle == fast){
			$('.middle-rotor-select').parent().addClass('bg-warning');
		}
		if(fast == slow || fast == middle){
			$('.fast-rotor-select').parent().addClass('bg-warning');
		}
	},
	showCircuitPath: function(input, output){
		this.clearAllHotWiresAndContacts();
		
		$('.entry-wheel .alphabet-' + input).addClass('hot-in');
		$('.entry-wheel .alphabet-' + output).addClass('hot-out');
		
		$('.plugboard .alphabet-' + this.enigma.plugboard.translate(input)).addClass('hot-in');
		$('.plugboard .alphabet-' + this.enigma.plugboard.translate(output)).addClass('hot-out');		
		$('.plugboard-wire-' + input).addClass('hot-in');
		$('.plugboard-wire-' + output).addClass('hot-out');
		
		var rotors = ['fast-rotor', 'middle-rotor', 'slow-rotor'];
		for(var i in rotors){
			var active_rotor = this.enigma.rotors[(this.enigma.rotors.length == 4) ? 3 - i : 2 - i];
			$('.' + rotors[i] + '-wire-' + this.toAlphabet(active_rotor.encipher_contact_position_right + active_rotor.ring_setting)).addClass('hot-in');
			$('.' + rotors[i] + '-wire-' + this.toAlphabet(active_rotor.decipher_contact_position_right + active_rotor.ring_setting)).addClass('hot-out');
			$('.' + rotors[i] + ' .alphabet-pair-right .alphabet-' + this.toAlphabet(active_rotor.encipher_contact_position_right + active_rotor.ring_setting)).addClass('hot-in');
			$('.' + rotors[i] + ' .alphabet-pair-left .alphabet-' + this.toAlphabet(active_rotor.encipher_contact_position_left + active_rotor.ring_setting)).addClass('hot-in');
			$('.' + rotors[i] + ' .alphabet-pair-left .alphabet-' + this.toAlphabet(active_rotor.decipher_contact_position_left + active_rotor.ring_setting)).addClass('hot-out');
			$('.' + rotors[i] + ' .alphabet-pair-right .alphabet-' + this.toAlphabet(active_rotor.decipher_contact_position_right + active_rotor.ring_setting)).addClass('hot-out');
			var rotor_offset = (26 - active_rotor.deflection) + active_rotor.ring_setting;	
			$('.' + rotors[i] + ' .wire-path-targets .alphabet-' + this.toAlphabet(active_rotor.encipher_contact_position_left + rotor_offset)).addClass('hot-in');
			$('.' + rotors[i] + ' .wire-path-targets .alphabet-' + this.toAlphabet(active_rotor.decipher_contact_position_left + rotor_offset)).addClass('hot-out');		
		}

		if(this.enigma.rotors.length == 4){
			$('.thin-rotor-wire-' + this.toAlphabet(this.enigma.rotors[0].encipher_contact_position_right + this.enigma.rotors[0].ring_setting)).addClass('hot-in');
			$('.thin-rotor-wire-' + this.toAlphabet(this.enigma.rotors[0].decipher_contact_position_right + this.enigma.rotors[0].ring_setting)).addClass('hot-out');
		}
		
		if(((this.enigma.rotors[0].encipher_contact_position_left + this.enigma.reflector_wheel.deflection + (26 - this.enigma.rotors[0].deflection) + this.enigma.rotors[0].ring_setting) % 26) > ((this.enigma.rotors[0].decipher_contact_position_left + this.enigma.reflector_wheel.deflection + (26 - this.enigma.rotors[0].deflection) + this.enigma.rotors[0].ring_setting) % 26)){
			$('.reflector-wire-out-' + this.toAlphabet(this.enigma.rotors[0].decipher_contact_position_left + this.enigma.reflector_wheel.deflection + (26 - this.enigma.rotors[0].deflection) + this.enigma.rotors[0].ring_setting)).addClass('hot-in');
			$('.reflector-wire-middle-' + this.toAlphabet(this.enigma.rotors[0].decipher_contact_position_left + this.enigma.reflector_wheel.deflection + (26 - this.enigma.rotors[0].deflection) + this.enigma.rotors[0].ring_setting)).addClass('hot-out-in');
			$('.reflector-wire-in-' + this.toAlphabet(this.enigma.rotors[0].decipher_contact_position_left + this.enigma.reflector_wheel.deflection + (26 - this.enigma.rotors[0].deflection) + this.enigma.rotors[0].ring_setting)).addClass('hot-out');
		} else {
			$('.reflector-wire-in-' + this.toAlphabet(this.enigma.rotors[0].encipher_contact_position_left + this.enigma.reflector_wheel.deflection + (26 - this.enigma.rotors[0].deflection) + this.enigma.rotors[0].ring_setting)).addClass('hot-in');
			$('.reflector-wire-middle-' + this.toAlphabet(this.enigma.rotors[0].encipher_contact_position_left + this.enigma.reflector_wheel.deflection + (26 - this.enigma.rotors[0].deflection) + this.enigma.rotors[0].ring_setting)).addClass('hot-in-out');
			$('.reflector-wire-out-' + this.toAlphabet(this.enigma.rotors[0].encipher_contact_position_left + this.enigma.reflector_wheel.deflection + (26 - this.enigma.rotors[0].deflection) + this.enigma.rotors[0].ring_setting)).addClass('hot-out');
		}
		
		if(this.enigma.rotors.length == 4){
			$('.thin-rotor .alphabet-pair-right .alphabet-' + this.toAlphabet(this.enigma.rotors[0].encipher_contact_position_right + this.enigma.rotors[0].ring_setting)).addClass('hot-in');
			$('.thin-rotor .alphabet-pair-left .alphabet-' + this.toAlphabet(this.enigma.rotors[0].encipher_contact_position_left + this.enigma.rotors[0].ring_setting)).addClass('hot-in');
			$('.thin-rotor .alphabet-pair-left .alphabet-' + this.toAlphabet(this.enigma.rotors[0].decipher_contact_position_left + this.enigma.rotors[0].ring_setting)).addClass('hot-out');
			$('.thin-rotor .alphabet-pair-right .alphabet-' + this.toAlphabet(this.enigma.rotors[0].decipher_contact_position_right + this.enigma.rotors[0].ring_setting)).addClass('hot-out');
		}
		
		$('.reflector .alphabet-' + this.toAlphabet(this.enigma.rotors[0].encipher_contact_position_left + this.enigma.reflector_wheel.deflection + (26 - this.enigma.rotors[0].deflection) + this.enigma.rotors[0].ring_setting)).addClass('hot-in');
		$('.reflector .alphabet-' + this.toAlphabet(this.enigma.rotors[0].decipher_contact_position_left + this.enigma.reflector_wheel.deflection + (26 - this.enigma.rotors[0].deflection) + this.enigma.rotors[0].ring_setting)).addClass('hot-out');		

		var rotor_offset = (26 - this.enigma.rotors[0].deflection) + this.enigma.rotors[0].ring_setting;
		$('.thin-rotor .wire-path-targets .alphabet-' + this.toAlphabet(this.enigma.rotors[0].encipher_contact_position_left + rotor_offset)).addClass('hot-in');			
		$('.thin-rotor .wire-path-targets .alphabet-' + this.toAlphabet(this.enigma.rotors[0].decipher_contact_position_left + rotor_offset)).addClass('hot-out');				
	},
	clearAllHotWiresAndContacts: function(){
		$('.contacts div div').each(function(idx, item){
			$(item).removeClass('hot-in');
			$(item).removeClass('hot-out');
		});
		$('.wire-path-targets div').each(function(idx, item){
			$(item).removeClass('hot-in');
			$(item).removeClass('hot-out');
		});
		$('.wire').removeClass('hot-in').removeClass('hot-out').removeClass('hot-in-out').removeClass('hot-out-in');
	},
	clearAllHotContactsAndPathTargets: function(){
		$('.contacts div div').each(function(idx, item){
			$(item).removeClass('hot-in');
			$(item).removeClass('hot-out');
		});
		$('.wire-path-targets div').each(function(idx, item){
			$(item).removeClass('hot-in');
			$(item).removeClass('hot-out');
		});		
	},
	enigmaPlay: function(){
		if(!this.running){
			$('.enigma-play').removeClass('active').text('Play');
			return;
		}

		$('.enigma-step').click();
		this.running = $('.bulk-text-input').val().length > 0 && this.running;
		var that = this;
		setTimeout(function(){
			that.enigmaPlay();
		}, this.running ? ($('.enigma-play-x10').hasClass('active') ? 100 : ($('.enigma-play-x2').hasClass('active') ? 250 : 500 ) ) : 0);
	}
}
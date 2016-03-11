(function($){
    $.fn.slot_machine = function( options ) {

        var defaults = {
            code: ['cat'],
            answer: ['cat']
        };

        options = $.extend(defaults, options);

        var code = options.code;
        var answer = options.answer;
        var numEntries = code.length;
        
       
        for(var i = 0; i < numEntries; i++) {
            code[i] = options.code[i].toUpperCase();
            answer[i] = options.answer[i].toUpperCase();
        }
       

        /* Generate the reels
        ============================================================================*/
        var reels = '';
        var num_reels = 6;
        var letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z', '♦'];
        var append = '';

        for(var i = 0; i < num_reels; i++) {
            var k = i + 1;
            reels += '<div class="reel-frames" id="reel-' + k + '"><div class="reels-machinery"><div class="reel">';
            var n = 1;
            for(var j = 0; j < 30; j++) {
                if(j == 0) {
                    append = ' first';
                }
                else {
                    append = '';
                }
                if(j < 27) {
                    k = j + 1;
                    reels += '<div class="figures figure-' + k + append + '">' + letters[j] + '</div>';
                }
                if(j >= 27) {
                    reels += '<div class="figures figure-' + n + append + '">' + letters[n-1] + '</div>';
                    n++;
                }
            }
            reels += '</div></div></div>';
        }
        $('#framework-center').html(reels);

        var width = ( num_reels * 12 ) + 16;

        $('#machine').css({'width': width+'em'});

        /* Functionality of the reels here
        ============================================================================*/

        // Max length of input field
        $('#machine-marquee').prop('maxlength', 6);
        $('#machine-marquee').focus();

        // Lever clicking
        $('#lever-ball').click(function() {
            trigger_motion(answer, code);
        });
        // Enter key pressing
        $('input').bind('keypress', function(e) {
            var keyPressed = e.keyCode || e.which;
            if(keyPressed == 13) {
                trigger_motion(answer, code);
            }
        });

        function trigger_motion(answer, code) {
            var guess = $('#machine-marquee').prop('value').toUpperCase();

            // Only trigger motion when there is a guess
            if(guess.length > 0) {

                // move the lever
                $('#lever-ball').animate(
                    { 'height': '6em', 'width': '6em', 'bottom': '2.5em', 'right': '3em' },
                    1000,
                    function() {
                        $('#lever-ball').animate(
                            { 'height': '5em', 'width': '5em', 'bottom': '11.5em', 'right': '2em' },
                            1500
                        );
                    }
                );
                $('#lever-bar').animate(
                    { 'height': '22em', 'bottom': '11em' },
                    1000,
                    function() {
                        $('#lever-bar').animate(
                            { 'height': '30em', 'bottom': '13em' },
                            1500
                        );
                    }
                );

                // move the reels
                for(var i = 0; i < num_reels; i++) {
                    var j = i + 1;
                    var k = i + 2;
                    var min = 1;
                    var max = 27;
                    var figure = Math.floor(Math.random() * (max - min + 1)) + min;
                    move_reel($('#reel-'+ j +' .first'), k, figure, j, answer, guess, code, numEntries);
                }
            }
        }

        function move_reel(reel, repeats, figure, start, answer, guess, code, numEntries) {
            $.extend( $.easing,
            {
                easeInQuad: function (x, t, b, c, d) {
                    return c*(t/=d)*t + b;
                },
                easeOutQuad: function (x, t, b, c, d) {
                    return -c *(t/=d)*(t-2) + b;
                }
            });
            var time = 250;
            var easing = 'linear';
            var marginT = -1.3;
            var answer_letters = [];
            var answer_letters_length = [];

            for(var h = 0; h < numEntries; h++) {
                answer_letters[h] = answer[h].split('');
                answer_letters_length[h] = answer_letters[h].length;
                if(answer_letters_length[h] < 6) {
                    var numLeftOver = 6 - answer_letters_length[h];
                    for(var i = 0; i < numLeftOver; i++) {
                        answer_letters[h].push('♦');
                    }
                }
            }
            
            if (typeof start === 'undefined') {
                time = 1500;
                easing = 'easeInQuad';
            }
            else if (repeats == 0) {
                time = 1500;
                easing = 'easeOutQuad';
                marginT = -1.3*figure;
            }

            reel.css({ 'margin-top': '.5em' });
            /*
            $('#reel-1 .first').css({ 'margin-top': '-10.35em' });
            $('#reel-2 .first').css({ 'margin-top': '-9.05em' });
            $('#reel-3 .first').css({ 'margin-top': '-6.45em' });
            $('#reel-4 .first').css({ 'margin-top': '-3.85em' });
            $('#reel-5 .first').css({ 'margin-top': '-1.25em' });
            $('#reel-6 .first').css({ 'margin-top': '.05em' });*/

            reel.animate(
                { 'margin-top': marginT.toString()+'em' },
                time,
                easing,
                function() {
                    if (repeats > 0) {
                        move_reel(reel, repeats-1, figure, 1, answer, guess, code, numEntries);
                    }
                }
            )
            for(var h = 0; h < numEntries; h++) {
                if(guess == code[h]) {
                    repeats = 0;
                    for(var i = 0; i < 7; i++) {
                        var j = i + 1;
                        $('#reel-' + j + ' .figures').each(function(index){
                            if($(this).text() == answer_letters[h][i]) {
                                var currPos = 1.3 * (index - 1);
                                $('#reel-' + j + ' .first').animate({'margin-top': '-' + currPos + 'em'});
                                $(this).addClass('selected');
                            }
                            else {
                                $(this).removeClass('selected');
                            }
                            if(index > 26) {
                                return false;
                            }
                        });
                    }
                    return false;
                }
            }
        }
    }
}( jQuery ));
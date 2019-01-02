$(function () {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var $form = $('#form'),
        $scale = $('#scale'),
        $octaves = $('#octaves'),
        $octStep = $('#octStep'),
        $persistence = $('#persistence'),
        $style = $('#style'),
        $treshold = $('#treshold'),
        $lines = $('#lines'),
        $thickness = $('#thickness'),
        $pixels = $('#pixels'),
        $time = $('#time'),
        $pixelsperms = $('#pixelsperms'),
        $copy = $('#copy'),
        $contrast = $('#contrast'),
        $wait = $('#wait'),
        $submit = $('#submit'),
        $presets = $('#presets'),
        $presetList = $('#presetList'),
        $minimize = $('#minimize'),
        $page = $('#page'),
        $color = $('#color'),
        $canvas = $('#canvas'),
        $animate = $('#animate'),
        $speed = $('#speed');

    var presets = {
        'Woah!': {
            scale: 1500,
            octaves: 1,
            style: 'bump',
            contrast: 100,
            animate: 'Yes',
            speed: 1
        },
        'Mount Doom': {
            scale: 1,
            octaves: 3,
            octStep: 10,
            persistence: 2,
            style: 'linear',
            color: 'fire',
            speed: 1
        },
        'Trippy Lines': {
            scale: 400,
            octaves: 4,
            octStep: 2,
            persistence: 2,
            style: 'lines',
            lines: 50,
            thickness: 2,
            speed: 0.5
        },
        'Satellite View': {
            scale: 1,
            octaves: 11,
            octStep: 2,
            persistence: 2,
            style: 'terrain',
            treshold: 50,
            animate: 'No',
            speed: 0.5
        },
        'Beautiful Colors': {
            scale: 1,
            octaves: 15,
            octStep: 2,
            persistence: 2,
            style: 'bump',
            contrast: 70,
            animate: 'No',
            speed: 1
        },
        'Far Out!': {
            scale: 2000,
            octaves: 1,
            style: 'lines',
            lines: 400,
            thickness: 0.6,
            animate: 'No'
        },
        'Smooth': {
            scale: 2000,
            octaves: 1,
            style: 'bump',
            contrast: 18,
            animate: 'Yes',
            speed: 2
        },
        'Clouds': {
            scale: 10,
            octaves: 8,
            octStep: 2,
            persistence: 2,
            style: 'linear',
            color: 'blue',
            speed: 0.5
        }
    };
    var key;
    for(key in presets){
        if(presets.hasOwnProperty(key)){
            $presetList.append('<li>' + key + '</li>');
        }
    }

    $(window).resize(function(){
        if($animate.val() === 'Yes') {
            canvas.width = $(window).width() / 10;
            canvas.height = $(window).height() / 10;
            image = context.createImageData(canvas.width, canvas.height);
        }
    });
    $(window).trigger('resize');
    $(document).tooltip({
        show: {effect: 'none', duration: 0},
        hide: {effect: 'none', duration: 0},
        position: { my: "left top+30", at: "left bottom", collision: "flipfit" },
        track: true
    });

    $presets.find('li').click(function(){
        var key, preset = presets[$(this).text()];
        for(key in preset) {
            if(preset.hasOwnProperty(key)){
                $('#' + key).val(preset[key]);
            }
        }
        $form.trigger('change');
        $(this).addClass('selected');
        if($animate.val() === 'No'){
            setTimeout(flash($submit,'highlight'),300);
        } else {
            start();
        }
    });
    $minimize.click(function(){
        $page.addClass('noShadow').toggleClass('minimized',{
           duration: 800,
           easing: 'easeInOutQuart',
           complete: function(){
               $page.removeClass('noShadow');
           }
        });
        if($presets.is(':visible')){
            $presets.toggle('slide');
        } else {
            setTimeout(function(){
                $presets.toggle('slide');
            },400);
        }
    });
    $animate.click(function(){
       if($animate.val() === 'Yes'){
           $animate.val('No');
       } else {
           if(validate()){
               $animate.val('Yes');
               start();
           }
       }
        $form.trigger('change');
    });
    $submit.click(start);
    function validate() {
        var fail = false;
        if(!($scale.val() > 0)) {
            fail = true;
            flash($scale, 'fail');
        }
        if(!($octaves.val() >= 1 && isInt($octaves.val()))) {
            fail = true;
            flash($octaves, 'fail');
        }
        if(!($octStep.val() >= 0 && $octStep.val() !== '')) {
            fail = true;
            flash($octStep, 'fail');
        }
        if(!($persistence.val() > 0)) {
            fail = true;
            flash($persistence, 'fail');
        }
        if(!($treshold.val() >= 0 &&  $treshold.val() <= 100 && $treshold.val() !== '' || $treshold.is(':hidden'))) {
            fail = true;
            flash($treshold, 'fail');
        }
        if(!($lines.val() >= 2 && isInt($lines.val()) || $lines.is(':hidden'))) {
            fail = true;
            flash($lines, 'fail');
        }
        if(!($thickness.val() > 0  || $thickness.is(':hidden'))) {
            fail = true;
            flash($thickness, 'fail');
        }
        if(!($contrast.val() > 0  || $contrast.is(':hidden'))) {
            fail = true;
            flash($contrast, 'fail');
        }
        if (fail) {
            $page.effect('shake');
        }
        return !fail;
    }
    function start() {
        if (validate()) {
            if($animate.val() === 'Yes') {
                $(window).trigger('resize');
                if (!animating){
                    requestAnimationFrame(loop);
                    animating = true;
                }
            }
            else {
                $wait.show();
                $submit.val('Generating...').removeClass('done').addClass('generating');
                setTimeout(function(){
                    makeNoise();
                    $wait.hide();
                    $submit.val('Done!').removeClass('generating').addClass('done');
                    setTimeout(function(){
                        $submit.val('Generate').removeClass('done');
                    },1000);
                },20);
            }
        }
    }
    $(window).keypress(function(event){
        if(event.which === 99) {
            prompt("Copy to clipboard: Ctrl+C, Enter", 'perlin({x: x, y: y, scale: ' + $scale.val() + ', octaves: ' + $octaves.val() + ', octStep: ' + $octStep.val() + ', persistence: ' + $persistence.val() + '});');
        }
    });

    $form.change(function(){
        if ($style.val() === 'terrain' || $style.val() === 'treshold') {
            $treshold.parent().slideDown('fast');
        } else {
            $treshold.parent().slideUp('fast');
        }
        if ($style.val() === 'lines') {
            $lines.parent().parent().slideDown('fast');
        } else {
            $lines.parent().parent().slideUp('fast');
        }
        if ($style.val() === 'bump') {
            $contrast.parent().slideDown('fast');
        } else {
            $contrast.parent().slideUp('fast');
        }
        if ($style.val() === 'linear') {
            $color.parent().slideDown('fast');
        } else {
            $color.parent().slideUp('fast');
        }
        if ($animate.val() === 'Yes') {
            $submit.val('Animating...').addClass('busy');
            $speed.parent().slideDown('fast');
        } else {
            $submit.val('Generate').removeClass('busy');
            $speed.parent().slideUp('fast');
        }
        if ($speed.val() > 0) {
            speed = Number($speed.val());
        }
        $presets.find('li').removeClass('selected');
    });

    noise.seed(Math.random());
    var z = 0,
        speed = 1;
    function loop(){
        if($animate.val() !== 'Yes') {
            animating = false;
            return;
        }
        var t = new Date();
        requestAnimationFrame(loop);
        makeNoise(z);
        var ms = new Date().getTime() - t.getTime();
        if (ms > 16) {
            z += speed * ms / 16;
        } else {
            z += speed;
        }
    }
    $form.trigger('change');
    requestAnimationFrame(loop);
    var animating = true;

    function perlin(x, y, scale, octaves, octStep, persistence, offset) {
        var i, noise = 0, frequency, amplitude, max = 0;
        for (i = 0; i < octaves; i++) {
            frequency = Math.pow(octStep, i) * scale;
            amplitude = Math.pow(persistence, i);
            noise += amplitude * (window.noise.simplex2(x/frequency, y/frequency)+1);
            max += amplitude * 2;
        }
        return noise / max;
    }
    function perlin3d(x, y, z, scale, octaves, octStep, persistence, offset) {
        var i, noise = 0, frequency, amplitude, max = 0;
        for (i = 0; i < octaves; i++) {
            frequency = Math.pow(octStep, i) * scale;
            amplitude = Math.pow(persistence, i);
            noise += amplitude * (window.noise.simplex3(x/frequency, y/frequency, z/frequency)+1);
            max += amplitude * 2;
        }
        return noise / max;
    }
    var image = context.createImageData(canvas.width, canvas.height);
    function makeNoise() {
        var scale = Number($scale.val()),
            octaves = Number($octaves.val()) || 1,
            octStep = Number($octStep.val()) || 2,
            persistence = Number($persistence.val()) || 2,
            style = $style.val(),
            treshold = Number($treshold.val()/100*255) || 50,
            lines = Number($lines.val()) || 5,
            thickness = Number($thickness.val()) || 2,
            contrast = Number($contrast.val()) || 10,
            color = $color.val(),
            animate = ($animate.val() === 'Yes');
        if (animate) {
            scale = scale / 10;
        }
        switch (style) {
            case 'terrain':
                style = 1;
                break;
            case 'bump':
                style = 2;
                break;
            case 'lines':
                style = 3;
                break;
            case 'linear':
                style = 4;
                break;
            case 'treshold':
                style = 5;
                break;
        }
        switch (color) {
            case 'greyscale':
                color = 1;
                break;
            case 'fire':
                color = 2;
                break;
            case 'fuchsia':
                color = 3;
                break;
            case 'purple':
                color = 4;
                break;
            case 'blue':
                color = 5;
                break;
            case 'minty':
                color = 6;
                break;
            case 'lime':
                color = 7;
                break;
        }
        if(!animate) {
            noise.seed(Math.random());
            canvas.width = $(window).width() * window.devicePixelRatio;
            canvas.height = $(window).height() * window.devicePixelRatio;
            image = context.createImageData(canvas.width, canvas.height);
        }

        var i, j, pixel, pixel2, temp = [], min = 255, max = -255, x = 0 ,y = 0;
        for (i = 0; i < image.data.length; i += 4) {
            if(animate) {
                pixel = perlin3d(x, y, z, scale, octaves, octStep, persistence, 0)*255;
            } else {
                pixel = perlin(x, y, scale, octaves, octStep, persistence, 0)*255;
            }
            switch (style) {
                case 1: //Terrain
                    if (pixel > treshold) { //Land
                        image.data[i] = pixel * 2 - 128 - treshold;
                        image.data[i + 1] = pixel * 2 - 75 - treshold;
                        image.data[i + 2] = pixel * 2 - 128 - treshold;
                    } else { //Water
                        image.data[i] = pixel / 8;
                        image.data[i + 1] = pixel / 8 + 16;
                        image.data[i + 2] = pixel / 8 + 32;
                    }
                    break;
                case 2: //Bump
                    temp[i / 4] = pixel;
                    break;
                case 3: //Lines
                    pixel2 = false;
                    for(j = 1; pixel2 === false && j < lines; j++) {
                        pixel2 = (pixel > 255 / lines * j && pixel < (255 / lines * j) + thickness);
                    }
                    pixel2 = 255 - pixel2 * 255;
                    image.data[i] = pixel2;
                    image.data[i + 1] = pixel2;
                    image.data[i + 2] = pixel2;
                    break;
                case 4: //Linear
                    switch (color) {
                        case 1: //Greyscale
                            image.data[i] = pixel;
                            image.data[i + 1] = pixel;
                            image.data[i + 2] = pixel;
                            break;
                        case 2: //Fire
                            image.data[i] = pixel * 3;
                            image.data[i + 1] = pixel * 3 - 128;
                            image.data[i + 2] = pixel * 3 - 255;
                            break;
                        case 3: //Fuchsia
                            image.data[i] = pixel * 3;
                            image.data[i + 1] = pixel * 3 -256;
                            image.data[i + 2] = pixel * 3 -128;
                            break;
                        case 4: //Purple
                            image.data[i] = pixel * 3 -128;
                            image.data[i + 1] = pixel * 3 - 255;
                            image.data[i + 2] = pixel * 3;
                            break;
                        case 5: //Blue
                            image.data[i] = pixel * 3 -255;
                            image.data[i + 1] = pixel * 3 -128;
                            image.data[i + 2] = pixel * 3;
                            break;
                        case 6: //Minty
                            image.data[i] = pixel * 3 -255;
                            image.data[i + 1] = pixel * 3;
                            image.data[i + 2] = pixel * 3 -128;
                            break;
                        case 7: //Lime
                            image.data[i] = pixel * 3 -128;
                            image.data[i + 1] = pixel * 3;
                            image.data[i + 2] = pixel * 3 -255;
                            break;
                    }
                    break;
                case 5: //Treshold
                    pixel = (pixel > treshold) * 255;
                    image.data[i] = pixel;
                    image.data[i + 1] = pixel;
                    image.data[i + 2] = pixel;
                    break;
            }
            image.data[i + 3] = 255;
            x++;
            if (x >= image.width) {
                x = 0;
                y++;
            }
        }
        if (style === 2) { //Bump
            x = 0;
            y = 0;
            for (i = 0; i < temp.length; i++) {
                if (i % image.width === 0) {
                    x = 0;
                    y ++;
                }
                if (y < image.height) {
                    image.data[i * 4] = (temp[i] - temp[i + image.width]) * contrast * contrast * scale * octaves * octaves / 1000 + 128;
                } else {
                    image.data[i * 4] = (temp[i - image.width] - temp[i]) * contrast * contrast * scale * octaves * octaves / 1000+ 128;
                }
                if (x + 1 < image.width) {
                    image.data[i * 4 + 1] = (temp[i] - temp[i + 1]) * contrast * contrast * scale * octaves * octaves / 1000+ 128;
                } else {
                    image.data[i * 4 + 1] = (temp[i - 1] - temp[i]) * contrast * contrast * scale * octaves * octaves / 1000+ 128;
                }
                if (x > 0) {
                    if (y > 1) {
                        image.data[i * 4 + 2] = (temp[i] - temp[i - 1 - image.width]) * contrast * contrast * scale * octaves * octaves / 1000+ 128;
                    } else {
                        image.data[i * 4 + 2] = (temp[i + image.width] - temp[i - 1]) * contrast * contrast * scale * octaves * octaves / 1000+ 128;
                    }
                } else {
                    if (y > 1) {
                        image.data[i * 4 + 2] = (temp[i + 1] - temp[i - image.width]) * contrast * contrast * scale * octaves * octaves / 1000+ 128;
                    } else {
                        image.data[i * 4 + 2] = (temp[i + 1 + image.width] - temp[i]) * contrast * contrast * scale * octaves * octaves / 1000+ 128;
                    }
                }
                x++;
            }
        }

        context.putImageData(image, 0, 0);
    }
});
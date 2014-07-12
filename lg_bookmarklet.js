javascript:(function(){
    jQuery.expr[':'].regex = function(elem, index, match) {
        var matchParams = match[3].split(','),
            validLabels = /^(data|css):/,
            attr = {
                method: matchParams[0].match(validLabels) ? 
                            matchParams[0].split(':')[0] : 'attr',
                property: matchParams.shift().replace(validLabels,'')
            },
            regexFlags = 'ig',
            regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
        return regex.test(jQuery(elem)[attr.method](attr.property));
    };
    
    if (jQuery.faturaCek) {
        $(document).unbind('keydown', jQuery.faturaCek.keyFunc);
        $(document).unbind('keyup', jQuery.faturaCek.keyFunc);
        jQuery.faturaCek = null;
        if($('#faturaDetay').length) $('#faturaDetay').remove();
        if($('#sfi').length) $('#sfi').remove();
        if($('#toBeDeleted').length) $('#toBeDeleted').remove();
        console.log('Everything nulled!');
    }

    jQuery.faturaCek = new Object();

    jQuery.faturaCek.globs = new Object();
    
    jQuery.faturaCek.faturaDetay = new Object();

    jQuery.faturaCek.globs.checkStart = 0;
    
    jQuery.faturaCek.globs.shiftDown = false;
    
    jQuery.faturaCek.globs.ctrlDown = false;
    
    jQuery.faturaCek.keyFunc = function (evnt) {
        if (evnt.keyCode == 16){
            jQuery.faturaCek.globs.shiftDown = !jQuery.faturaCek.globs.shiftDown;
        } else if (evnt.keyCode == 17){
            jQuery.faturaCek.globs.ctrlDown = !jQuery.faturaCek.globs.ctrlDown;
        }
    };

    jQuery.faturaCek.checkChanged = function(index){
        if (jQuery.faturaCek.globs.shiftDown) {
            console.log("check start = " + jQuery.faturaCek.globs.checkStart + ", index = " + index);
            for(var i = jQuery.faturaCek.globs.checkStart; i < index; i++){
                $("#p_scnt_" + i).attr( "checked", "true");
            }
        }else if (jQuery.faturaCek.globs.ctrlDown) {
            for(var i = jQuery.faturaCek.globs.checkStart; i < index; i++){
                $("#p_scnt_" + i).removeAttr( "checked");
            }
        }else {
            jQuery.faturaCek.globs.checkStart = index * 1;
        }
    };
    
    jQuery.faturaCek.faturaDetay.htmlButton = "<input style='margin:15px; padding:5px' type='button' id='sfi' value='Seçili Faturaları İndir' onclick='jQuery.faturaCek.faturaIndir()'/>"
    
    jQuery.faturaCek.faturaDetay.htmlStart = "<table style='margin:15px;' cellpadding='0' cellspacing='0' width='100%' id='faturaDetay'><tbody><tr class='listbaslik'><td colspan='7' align='center'>MİVENTO FATURA DETAYLARI</td></tr><tr class='listbaslik'><td align='center' width='60'>Fatura Tarihi</td><td align='center' width='80'>Fatura Numarası</td><td align='center' width='140'>Firma Ünvanı</td><td align='center' width='100'>Ürün Açıklaması</td><td align='center' width='40'>Miktar</td><td align='center' width='60'>İskontolu Fiyat</td><td align='center' width='60'>Tutar</td></tr>";
    
    jQuery.faturaCek.faturaDetay.htmlMain = "<tr class='list' id='S1'>            <td align='center' width='60'>tarih</td>            <td align='center' width='80'>numara</td>        	<td align='center' width='140'>unvan</td>        	<td align='center' width='100'>aciklama</td>            <td align='center' width='40'>miktar</td>            <td align='center' width='60'>fiyat</td>            <td align='center' width='60'>tutar</td></tr>";
    
    jQuery.faturaCek.faturaDetay.htmlEnd = "</tbody></table>";
    
    jQuery.faturaCek.faturaDetay.htmlResult = jQuery.faturaCek.faturaDetay.htmlStart;
    
    jQuery.faturaCek.faturaDetay.endWork = function(id){
        jQuery.faturaCek.faturaDetay.htmlResult += jQuery.faturaCek.faturaDetay.htmlEnd;
        $('.pageWrapper').html($('.pageWrapper').html() + jQuery.faturaCek.faturaDetay.htmlResult);
    }
    
    jQuery.faturaCek.faturaIndir = function(){
        var faturaIdleri = [];
        $('input:checked').closest('tr').find('input[name=faturaid]').each(
                function(index){
                    faturaIdleri.push($(this).val());
                }
            );
        // console.log (faturaIdleri);
        jQuery.faturaCek.faturaDetay.get(faturaIdleri);
    }
    
    jQuery.faturaCek.faturaDetay.get = function(fIds){
        var matchTableClass = ".faturaicerik",
            matchDivUnvanClass = ".unvan",
            matchTdVergiClass = ".vergi",
            matchTdCodeClass = ".kolon1",
            matchTdAciklamaClass = ".kolon2",
            matchTdMiktarClass = ".kolon3",
            matchTdFiyatClass = ".kolon4",
            matchTdTutarClass = ".kolon5",
            matchTdKolon6Class = ".kolon6"
            
        var fTarih = '', fNo = '', index;
            
        for (index = 0; index < fIds.length; ++index){
            id = fIds[index];
            (function(id){ // self executing function. This is needed
            // because .load() function is async and id is a reference 
            // and gets the value of the last loop
            // at the time of the callback!
                var $temptable = $('<table>'),
                    $tempHtmlMain = "";
                $temptable.load('ht' + 'tp' + '://' + 'yone' + 'tim' + '.mo' + 'bi' + 'lh' + 'edi' + 'yem' + '.' + 'co' + 'm/' + 'ra' + 'por.' + 'f' + 'at' + 'u' + 'ra.p' + 'hp' + '?f' + 'atur' + 'aid=' + id + ' ' + matchTableClass, function(){
                    var unvan = $(matchDivUnvanClass, $(this)).contents().eq(0).text(),
                        vergi = $(matchTdVergiClass, $(this)).slice(1),
                        code = $(matchTdCodeClass, $(this)).slice(1),
                        aciklama = $(matchTdAciklamaClass, $(this)).slice(1),
                        miktar = $(matchTdMiktarClass, $(this)).slice(1),
                        fiyat = $(matchTdFiyatClass, $(this)).slice(1),
                        tutar = $(matchTdTutarClass, $(this)).slice(1);
                    fTarih = $('#faturatarihi' + id).val();
                    fNo = $('#faturano' + id).val();
                    
                    var iskontoOrani = 1;
                    if (fiyat.eq(-1).text() == "İskonto : ") {
                        iskontoOrani = 1 - (tutar.eq(-1).text() / tutar.eq(-2).text());
                        console.log (iskontoOrani);
                    }
                    
                    $tempHtmlMain = "";
                    for (var j = 0; j < tutar.length; j++){
                        if (aciklama.eq(j).html() == "") continue;
                        $tempHtmlMain += $.faturaCek.faturaDetay.htmlMain;
                        $tempHtmlMain = $tempHtmlMain.replace('S1', 'Satir' + j + 1);
                        $tempHtmlMain = $tempHtmlMain.replace('tarih', fTarih);
                        $tempHtmlMain = $tempHtmlMain.replace('numara', fNo);
                        $tempHtmlMain = $tempHtmlMain.replace('unvan', unvan);
                        $tempHtmlMain = $tempHtmlMain.replace('aciklama', aciklama.eq(j).html());
                        $tempHtmlMain = $tempHtmlMain.replace('miktar', miktar.eq(j).html());
                        $tempHtmlMain = $tempHtmlMain.replace('fiyat', roundTo(fiyat.eq(j).html() * iskontoOrani, 3));
                        $tempHtmlMain = $tempHtmlMain.replace('tutar', tutar.eq(j).html());
                    }
                    jQuery.faturaCek.faturaDetay.htmlResult += $tempHtmlMain;
                    if (id == fIds[fIds.length -1]) jQuery.faturaCek.faturaDetay.endWork ();
                });
            })(id);
        }
    };
    
    $(document).keydown(jQuery.faturaCek.keyFunc).keyup(jQuery.faturaCek.keyFunc);
    
    function roundTo(num, dp) {    
        return +(Math.round(num + ("e+" + dp))  + ("e-" + dp));
    }

    function addCheckBoxes(){
      $('tr:has(input:regex(value, \\d{6}))').each(
		    function(index){
			    $(this).children().eq(3).html('<input type="checkbox" id="p_scnt_' + index +'" class="p_scnt" onchange="jQuery.faturaCek.checkChanged(\'' + index + '\');" />');
		    }
	    );
    }

    addCheckBoxes();
    
    $('.pageWrapper').html($('.pageWrapper').html() + jQuery.faturaCek.faturaDetay.htmlButton);
    
})();

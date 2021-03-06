$( function() {

    // DATE RANGE -- NEEDS TO RETURN THE NUMBER OF DAYS
    var from = new Date();
    var to = new Date();
    var dayDiff = 1;


    var dates = $( "#from, #to" ).datepicker({
    dateFormat: "yy, mm, dd",
    defaultDate: "+1w",
    changeMonth: true,
        numberOfMonths: 1,
        onSelect: function( selectedDate ) {
            var option = this.id == "from" ? "minDate" : "maxDate",
                instance = $( this ).data( "datepicker" ),
                date = $.datepicker.parseDate(
                    instance.settings.dateFormat ||
                    $.datepicker._defaults.dateFormat,
                    selectedDate, instance.settings );
            dates.not( this ).datepicker( "option", option, date );

            if (this.id == "from"){
                from = $(this).datepicker('getDate');
                if (!(to == "")){
                    update_days()
                }
            }
            if (this.id == "to"){
                to = $(this).datepicker('getDate');
                update_days()
            }
        }
    });


    function update_days(){
        dayDiff = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
        $("#days").empty()
        $("#days").append(++dayDiff)
    }





    $('#brand').selectmenu();





    function exportToCsv(filename, rows) {
        var processRow = function (row) {
            var finalVal = '';
            for (var j = 0; j < row.length; j++) {
                var innerValue = row[j] === null ? '' : row[j].toString();
                if (row[j] instanceof Date) {
                    innerValue = row[j].toLocaleString();
                };
                var result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0)
                    result = '"' + result + '"';
                if (j > 0)
                    finalVal += ',';
                finalVal += result;
            }
            return finalVal + '\n';
        };

        var csvFile = '';
        for (var i = 0; i < rows.length; i++) {
            csvFile += processRow(rows[i]);
        }

        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    $( "#download" ).on( "click", function() {

        nameOfCampaign = $('#campaignname').val();
        //brand = $('#brand').find(":selected").text();
        country = $('#country').find(":selected").text();
        channel = $('#channel').find(":selected").text();
        subchannel = $('#subchannel').find(":selected").text();
        realChannel = (channel+'_'+subchannel).toLowerCase();

        from = $('#from').datepicker({ dateFormat: 'dd/mm/yyyy' }).val();;
        to = $('#to').datepicker({ dateFormat: 'dd/mm/yyyy' }).val();;
        amountOfDays = parseInt( $("#days").text() );

        amount = parseInt( $('#amount').val() );

        campaignID = $('body').attr('campaignID');


        console.log( 'name of Campaign ' + nameOfCampaign);
        console.log( 'country ' + country);
        console.log( 'channel ' + channel);
        console.log( 'subchannel ' + subchannel);
        console.log( 'realChannel ' + realChannel);


        console.log( 'from ' + from);
        console.log( 'to ' + to);
        console.log( 'amountOfDays ' + amountOfDays);

        console.log( 'amount ' + amount);
        console.log( 'amountPerDay ' + (amount/amountOfDays));



        csvHeader = [
            'date',
            'display_reach',
            'display_rma',
            'display_rmo',
            'paidsocial_reach',
            'paidsocial_rma',
            'paidsocial_rmo',
            'sem_food',
            'sem_rest',
            'sem_gen',
            'sem_comp',
            'seo_nonbrand',
            'app_reach',
            'app_rma',
            'app_rmo',
            'crm_rmo_web',
            'crm_rmo_app',
            'promoted',
            'affiliate',
            'coop',
            'brand_sem',
            'brand_tv',
            'brand_tv_production',
            'brand_outdoor',
            'brand_radio',
            'brand_newspaper',
            'brand_rest_mktg',
            'remaning_discounts',
            'other'
        ];

        function generateArray(){
            thisArray = [];
            thisArray.push(csvHeader);

            //var start = new Date(from);
            //var end = new Date(to);


            Date.prototype.addDays = function(days) {
                var dat = new Date(this.valueOf())
                dat.setDate(dat.getDate() + days);
                return dat;
            }

            function getDates(startDate, stopDate) {
               var dateArray = new Array();
               var currentDate = startDate;
               while (currentDate <= stopDate) {
                 dateArray.push(currentDate)
                 currentDate = currentDate.addDays(1);
               }
               return dateArray;
             }

            var dateArray = getDates(new Date(from), (new Date(from)).addDays(amountOfDays));
            //console.log(dateArray);
            for (z = 0; z < dateArray.length; z++ ) {
                console.log (dateArray[z]);
                thisRow = [];
                for (var i = 0; i < csvHeader.length; i++) {

                    if (i == 0) {
                        formatedDate = (dateArray[z].getFullYear()) + '-' + (dateArray[z].getMonth() + 1) + '-' + (dateArray[z].getDate() );
                        thisRow[i] = formatedDate;

                    } else if (csvHeader[i] == realChannel){
                        thisRow[i] = (amount/amountOfDays).toFixed(2);
                    } else {
                        thisRow[i] = '0';
                    }

                }
                console.log (thisRow);
                thisArray.push(thisRow);
            }




            console.log (thisArray);

            return thisArray
        }

        exportToCsv( campaignID+'.csv', generateArray());
    });


    function setTarget(){
        used = parseInt( $("#used").text() );
        total = parseInt( $("#total").text() );


        percentage = used/(total/100);
        console.log('percentage ' + percentage);
        $('#loading-target span').text(percentage+'%');
        $('#loading-target span').css('width',percentage+'%');
    }
    setTarget();




    $('#fullpage').fullpage({
        afterResponsive: function(isResponsive){
        },
        onLeave: function(index, nextIndex, direction){
            if (index == 6){
                used = parseInt( $("#used").text() );
                amount = parseInt( $('#amount').val() );

                $("#used").html(amount + used);
                setTarget();
            }
        },
    });



});



$(document).ready(function() {

	var countrySelected = '';
    $.getJSON("/data/entities.json", function(obj) {
		for(var i=0 ; i < obj.alldata.length; i++)

			{
				var newEntity=$('<option class="country_loaded"></option>').text(obj.alldata[i]['management_entity_group']);
				$('.entities').append(newEntity);
			}



            $('#entities').on('selectmenuchange', function() {
				$('.country_id').text('');
				$(".hide-country").hide('fast');
				$(".countries option").remove();
				$(".hide-country").show('fast');
				var itemSelected = $(this).val();
				entitySelected = [];
				for(var i=0 ; i < obj.alldata.length; i++) {
					if (obj.alldata[i]['management_entity_group'] == itemSelected ){
						entitySelected.push(obj.alldata[i]['display_name']);
					}
				}

				for(var i=0 ; i < entitySelected.length; i++) {
					$('.countries').append('<option>' + entitySelected[i] + '</option>');
				}
                $('.countries').prepend('<option value="Select a Country" selected>Select Country</option>')


            });
            $('select').selectmenu();

            $(".countries").on('selectmenuchange', function() {
				$(".country_id").show('fast');
				var itemSelected = $(this).val();
				countrySelected = '';
				for(var i=0 ; i < obj.alldata.length; i++) {
					if (obj.alldata[i]['display_name'] == itemSelected ){
						countrySelected = obj.alldata[i]['source_id'];
					}
				}

				$('body').attr('campaignID', countrySelected);

			});

        });

        $.getJSON("/data/channels.json", function(obj) {
            for(var i=0 ; i < obj.alldata.length; i++)
                {
                    var channel=$('<option class="channel_loaded"></option>').text(obj.alldata[i]['channel']);
                    $('.channels').append(channel);
                }

                $(".channels").on('selectmenuchange', function() {

                    $(".hide-channel").hide('fast');
                    $(".subchannels option").remove();
                    $(".hide-channel").show('fast');
                    var itemSelected = $(this).val();
                    channelSelected = [];
                    for(var i=0 ; i < obj.alldata.length; i++) {
                        if (obj.alldata[i]['channel'] == itemSelected ){
                            channelSelected.push(obj.alldata[i]['subchannel']);
                            console.log(channel);
                        }
                    }
                    console.log(channelSelected);
                    for(var i=0 ; i < channelSelected.length; i++) {
                        $('.subchannels').append('<option>' + channelSelected[i] + '</option>');
                    }
                    $('.subchannels').prepend('<option selected>Select Sub-channel</option>')

                });


            });
            $('select').selectmenu();

            $( document ).bind( "mousedown.selectmenu-" + this.ids[ 0 ], function( event ) {
                //check if open and if the clicket targes parent is the same
                if ( self.isOpen && !$( event.target ).closest( "#" + self.ids[ 1 ] ).length && !$(event.target).hasClass('ui-selectmenu-menu-dropdown')) {
                    self.close( event );
                }
            });


    });


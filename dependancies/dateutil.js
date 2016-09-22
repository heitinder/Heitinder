/**
 * This js file consists date & time conversion related functions
 * Author : u408471
 * Date : 2/13/2016
 */


function formatUTCDate(date) {
    var dt = date.getUTCDate();
    var month = date.getUTCMonth()+1;
    var year = date.getUTCFullYear();
    var hour = date.getUTCHours();
    var min = date.getUTCMinutes();
    var am = 'AM';
    if(hour >= 12){
        am = 'PM';
        hour = hour - 12;
    }
    if(hour == 0){
        hour = 12;
    }
    if(year < 2000){
        year = year + 100;
    }
    return (((month < 10 ? '0':'') + month) + "/" +
    (( dt < 10 ? '0':'')+dt) + "/" +
    year + " " +((hour < 10?'0':'')+hour) + ":" +
    (min<10?'0':'') +  min + " " +am) ;

}

function formatDate(date) {
    var dt = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    var hour = date.getHours();
    var min = date.getMinutes();
    var am = 'AM';
    if(year < 2000){
        year = year + 100;
    }

    if(hour >= 12){
        am = 'PM';
        hour = hour - 12;
    }
    if(hour == 0){
        hour = 12;
    }
    return (((month < 10 ? '0':'') + month) + "/" +
    (( dt < 10 ? '0':'')+dt) + "/" +
    year + " " +((hour < 10?'0':'')+hour) + ":" +
    (min<10?'0':'') +  min + " " +am) ;
}

function isDST(t) { //t is the date object to check, returns true if daylight saving time is in effect.
    var jan = new Date(t.getFullYear(),0,1);
    var jul = new Date(t.getFullYear(),6,1);

    return Math.max(jan.getTimezoneOffset(),jul.getTimezoneOffset()) == t.getTimezoneOffset();
}

function getUTCDate(ipdate, ipzone){
    if(ipzone == null){
        ipzone = 'PST';
    }

    var dateStr = ipdate.split(' ');
    if(dateStr.length > 3){
        ipdate = dateStr[0]+' '+dateStr[1]+' '+dateStr[2];

    }
    var date = validateYear(new Date(ipdate));

    var zoneoffset = getOffset(ipzone,date);
    var diffoffset = date.getTimezoneOffset() - zoneoffset;
    var dt = new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()-diffoffset);

    return formatUTCDate(dt);
}

function getUTCDateinZone(utcdate, ipzone){
    if(ipzone == null){
        ipzone = 'PST';
    }
    var utcDt = validateYear(new Date(utcdate));

    var zoneoffset =  getOffset(ipzone,utcDt);
    var zonedate = new Date(utcDt.getFullYear(),utcDt.getMonth(),utcDt.getDate(),utcDt.getHours(),utcDt.getMinutes()-zoneoffset);
    return formatDate(zonedate);
}

function getOffset(ipzone,ipDate){
    var zoneoffset;


    if(MASTER_TIMEZONE == null){
        $.ajax({
            type: "GET",
            url: baseURLCompany+'timezones',
            dataType:'JSON',
            async:false,
            success:function(data){
                if(data.success == true)
                {
                    sessionStorage.setItem("timezones",  JSON.stringify(data.result));
                    MASTER_TIMEZONE = data.result;
                }
            }
        });


    }
    $.each(MASTER_TIMEZONE, function(index, element) {

        if(ipzone == element.timezoneCode){
            zoneoffset = element.offset;
            //alert(isDST(ipDate));
            if(!isDST(ipDate) && (ipzone == "EST" || ipzone == "CST" || ipzone == "PST")){
                zoneoffset = zoneoffset - 60;

            }
        }



    });
    return zoneoffset;
}

function getcompanyTimezone(companyid){
    var companytimezone = "PST";
    if(COMPANY_TIMEZONE != null){
        var companyzones = jQuery.parseJSON(COMPANY_TIMEZONE);
        $.each(companyzones, function(index, element) {
            if(companyid == element.companyId){
                companytimezone = element.timeZone;
            }
        });
    }
    return companytimezone;
}

function getfacilityTimezone(facilityid){

    var facilitytimezone = "PST";
    if(FACILITY_TIMEZONE != null){
        var facilityzones = jQuery.parseJSON(FACILITY_TIMEZONE);

        $.each(facilityzones, function(index, element) {
            if(facilityid == element.facilityId){
                facilitytimezone = element.timeZone;
            }
        });
    }
    return facilitytimezone;
}

function validateCurrentDate(ipdate,ipzone){
    var flag = true;
    var currdate = new Date();
    var currentUtcdate = new Date(currdate.getUTCFullYear(),currdate.getUTCMonth(),currdate.getUTCDate(),currdate.getUTCHours(),currdate.getUTCMinutes());
    var inputDate = validateYear(new Date(ipdate));

    if(Date.parse(inputDate) < Date.parse(currentUtcdate)){
        flag = false;
    }

    return flag;
}

function getLoyaltyEndDate(ipdate,ipzone){
    var dateStr = ipdate.split(' ');
    if(dateStr.length > 3){
        ipdate = dateStr[0]+' '+dateStr[1]+' '+dateStr[2];
    }
    var date = validateYear(new Date(ipdate));
    var zoneoffset = getOffset(ipzone,date);
    var diffoffset = date.getTimezoneOffset() - zoneoffset;
    var dt = new Date(date.getFullYear()+300,date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()-diffoffset);

    return formatUTCDate(dt);
}

function validateSaveDates(ipStartdt,ipEnddt){
    var flag = true;
    var currentUtcdate = formatUTCDate(new Date());

    var stdate = validateYear(new Date(ipStartdt));
    var eddate = validateYear(new Date(ipEnddt));
    var curdate = new Date(currentUtcdate);


    if(stdate < curdate){

        showAlert("Start Date & Time should be later than Current Date & Time",false,'Error',null);
        flag = false;
    }
    if(eddate < curdate){
        showAlert("End Date & Time should be later than Start Date & Time",false,'Error',null);
        flag = false;

    }
    if(eddate <= stdate){
        showAlert("End date should be later than Start date",false,'Error',null);
        flag = false;


    }
    return flag;
}

function validateEditDates(ipStartdt,ipEnddt){
    var flag = true;
    var currentUtcdate = formatUTCDate(new Date());
    var stdate = validateYear(new Date(ipStartdt));
    var eddate = validateYear(new Date(ipEnddt));
    var curdate = new Date(currentUtcdate);

    if(eddate < curdate){
        showAlert("End Date & Time should be later than Start Date & Time",false,'Error',null);
        flag = false;

    }
    if(eddate < stdate){
        showAlert("End date should be later than Start date",false,'Error',null);
        flag = false;


    }
    return flag;
}

function validateLoyaltyPgmDate(ipStartdt){
    var flag = true;
    var currentUtcdate = formatUTCDate(new Date());
    var stdate = validateYear(new Date(ipStartdt));
    var curdate = validateYear(new Date(currentUtcdate));

    if(stdate < curdate){
        showAlert("Start Date & Time should be later than Current Date & Time",false,'Error',null);
        flag = false;
    }

    return flag;
}

function validateYear(ipdate){
    if(ipdate.getFullYear() < 2000){
        ipdate.setFullYear(ipdate.getFullYear() + 100);
    }
    return ipdate;
}
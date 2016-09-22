/**
 * Created by DAY on 21-05-2016.
 */

$(document).ready(function () {
    var table = $('#example').DataTable({
        "ajax": "data.json",
        rowId:'id',
        "columns": [
            {"data": "name"},
            {"data": "position"},
            {"data": "office"},
            {"data": "extn"},
            {"data": "start_date"},
            {"data": "salary"},
            {"data": "extn"}
        ],
        "sDom": '<"top">rt<"bottom"p><"clear">'
    });
/* Datepicker Start*/
    $("#datepicker1,#dtRange,#datepicker2").hide();

    $('#datepicker1').datetimepicker();
    $('#datepicker2').datetimepicker({
        useCurrent: false //Important! See issue #1075
    });


    
    $("#datepicker1").on("dp.change", function (e) {
        $('#datepicker2').data("DateTimePicker").minDate(e.date);
    });
    $("#datepicker2").on("dp.change", function (e) {
        $('#datepicker1').data("DateTimePicker").maxDate(e.date);
        table.draw();

    });
    $("#dtRange").on("click",function(){
        $(this).hide();
        $("#datepicker2").show();
    });

    $("#search_filter").on("change",function(){
        var selVal=$('#search_filter').val().trim();
        if(selVal==5){
            $("#datepicker1,#dtRange").show();
            $("#datepicker1 input,#datepicker2 input").val('');
            $("#search_value").hide();

            /* custom filter */
            $.fn.dataTable.ext.search.push(
                function( settings, data, dataIndex ) {
                    var min = $('#datepicker1 input').val() ;
                    var max = $('#datepicker2 input').val();
                    var startDate = data[4]  || 0; // use data for the age column
                    min=new Date(min);
                    max=new Date(max);
                    if(startDate){
                        startDate=new Date(startDate);
                    }
                    console.log(min,max,startDate, min>startDate);

                    if ( min <= startDate   && startDate <= max )
                    {
                        return true;
                    }
                    return false;
                }
            );
        }else{
            $("#datepicker1,#dtRange,#datepicker2").hide();
            $("#search_value").show();
        }
    });



    /* Datepicker end*/
    $('#search_value').on('keyup change', function () {
        var col = $('#search_filter').val().trim();

        var searchText = $(this).val().trim();
        if (searchText) {
            table
                .column(col)
                .search(searchText)
                .draw();
        } else {
            table
                .search('').columns().search('').draw();
        }
    });

});

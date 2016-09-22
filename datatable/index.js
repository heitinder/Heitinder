
var $ = require( 'jquery' );
/*require('datatables.net' );
require('datatables.net-responsive' );
require('datatables.net-responsive-bs');
require('datatables.net-dt/css/jquery.dataTables.css' );
require('datatables.net-responsive-bs/css/responsive.bootstrap.css');
require('./index.scss');*/

$.extend($.fn.dataTable.defaults, {
    rowId: 'id',
    stripeClasses:[],
    lengthChange: false,
    info: false,
    responsive: true,
    filter:true
});

module.exports = { };

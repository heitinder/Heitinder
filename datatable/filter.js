
var
    $ = require('jquery'),
    FilterCriteria;

FilterCriteria = function () {};

FilterCriteria.prototype.init = function (table, filters) {
    this.table = table;
    this.filters = filters;
    this.el = {
        _filterForm : $('.cp-datatable-filter'),
        _filterSubmit : $('#filter_entity_submit'),
        _filterValue : $('#filterValue'),
        _filterOption : $('#filter'),
        _filterCriteria : $('#cp-filter-criteria')
    }

    this.bind();
};

FilterCriteria.prototype.bind = function(){
    var _view = this,
        _searchText;

    //Enable form and bind search event
    _view.el._filterForm
        .prop('disabled', false)
        .on('submit', function(e){
            e.preventDefault();
            if(_view.el._filterValue.val().trim() && _view.el._filterOption.val()){
                _view.add(_view);
            }
        });

    //Enable submit button on data
    _view.el._filterValue
        .on('keyup change', function () {
            _searchText = $(this).val().trim();
            if(_searchText.length >= 1){
                _view.el._filterSubmit.addClass('btn-primary').removeAttr('disabled');
            }else{
                _view.el._filterSubmit.prop('disabled', true).removeClass('btn-primary').removeClass('disabled');
            }
        });

    //Attach remove criteria event
    _view.el._filterCriteria
        .on('click', '.filter-criteria .close', function(e){
            e.preventDefault();
            $(this).parent().hide().remove();
            _view.remove(_view, $(this).parent().data('col'));
        });
}


FilterCriteria.prototype.template = function(options){
    //Criteria HTML
    var html  = "<div class='filter-criteria' data-col='"+options.column+"' data-val='"+options.searchText+"' >";
    html += "<button type='button' class='close'  aria-label='Close'>";
    html += "<span aria-hidden='true'>&times;</span>";
    html += "</button>";
    html += "<span class='field-name' >"+options.title+":</span><span class='field-value'>"+options.searchText+"</span>";
    html += "</div>";
    return html;
}

FilterCriteria.prototype.add = function (_view) {
    var _searchText,
        _searchOption;

    _searchText = _view.el._filterValue.val().trim();
    _searchOption = _view.el._filterOption.val();

    if (_view.filters[_searchOption] && _searchText) {
        _view.filters[_searchOption].text = _searchText;

        //Filter datatable
        _view.table
            .column(_view.filters[_searchOption].col)
            .search(_searchText)
            .draw();

        //Add criteria and disable search input
        _view.el._filterCriteria.show().append(function(){
            _view.el._filterValue.val('');
            _view.el._filterOption.val('');
            _view.el._filterOption.children("option[value=" + _searchOption + "]").prop('disabled', true);
            return _view.template({
                column: _searchOption,
                searchText : _searchText,
                title: _searchOption
            });
        });

    } else {
        _view.table
            .search('').columns().search('').draw();
    }
}

FilterCriteria.prototype.remove = function (_view, column) {

    _view.table.search('').columns(_view.filters[column].col).search('').draw();

    _view.el._filterOption.children("option[value=" + column + "]").removeAttr('disabled');

}

module.exports.FilterCriteria = FilterCriteria;
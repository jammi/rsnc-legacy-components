
/*** = Description
  ** HRadiobuttonList expects the setListItems to be set. See HListItems.
  ** The value of the instance is the selected key in the listItems.
  ***/
var//RSence.Lists
HRadioButtonList = HListItemControl.extend({
  drawSubviews: function(){
    this.setStyle('border','1px solid #999999');
    this.setStyle('border-radius','3px');
    this.setStyle('overflow-y','auto');
  },
  listItems: [],
  listItemViews: [],

/** = Description
  * Setter function for listItems and listItemViews. Destroys
  * the old HRadiabuttons before creating the new ones based on the
  * listItems given as an parameter.
  *
  * = Parameters
  * +_listItems+:: listItems is an array-packed array, where each index in the
  *                surrounding array contains a [ value, label ] pair.
  *                The value is mapped to the value of the HRadiobuttonList
  *                instance when its HRadiobutton instance is selected.
  *
  **/
  setListItems: function(_listItems){
    _listItems = this._cleanListItems(_listItems);
    var _listItem,
        _value,
        _label,
        _radioButton,
        _component,
        _selected = false,
        i = 0;
    for ( ; i < this.listItemViews.length; i++ ) {
      try {
        this.listItemViews[i].die();
      }
      catch(e) {
        console.log('HRadiobuttonList, setListItems item destruction error: ',e);
      }
    }
    this.listItems = _listItems;
    this.listItemViews = [];
    for ( i = 0 ; i < _listItems.length; i++ ){
      _listItem = _listItems[i];
      _value = _listItem[0];
      _label = _listItem[1];
      _component = this.createComponent( i, _label );
      if( _value === this.value ){
        _selected = _value;
      }
      this.listItemViews[i] = _component;
    }
    if( _selected !== false ){
      this.setValue(-1);
      this.setValue(_selected);
    }
    else if (this['valueMatrix'] !== undefined){
      this.setValue(-1);
      var
      _prevIndex = this.radioButtonIndexValue.value,
      _listLen = _listItems.length;
      if (this.radioButtonIndexValue) {
        this.radioButtonIndexValue.set(-1);
      }
      if( _listLen > 0 ){
        if( _listLen-1 < _prevIndex ){
          this.setValue(this.listItems[_listLen-1][0]);
        }
        else if (this.listItems[_prevIndex]){
          this.setValue(this.listItems[_prevIndex][0]);
        }
        else{
          this.setValue(this.listItems[0][0]);
        }
      }
    }
    this.refreshValue();
  },

  createComponent: function( i, _label ){
    return HRadiobutton.nu(
      [ 4, (i*23)+4, null, 23, 4, null ],
      this, {
        label: _label,
        enabled: this.enabled,
        value: false
      }
    );
  },

  _listItemResponder: null,
  setListItemResponder: function(_listItemResponder){
    this._listItemResponder = _listItemResponder;
  },

/** = Description
  * Destructor. Sets listItems and listItemViews to null and initiates
  * destructor for radioButtonIndexValue.
  *
  **/
  die: function(){
    if(this._listItemResponder){
      this._listItemResponder.die();
      this._listItemResponder = null;
    }
    this.radioButtonIndexValue && this.radioButtonIndexValue.die();
    this.listItems = null;
    if( this.listItemViews ){
      for(var i=0;i<this.listItemViews.length;i++){
        this.listItemViews[i].die();
      }
    }
    this.listItemViews = null;
    this.radioButtonIndexValue && this.radioButtonIndexValue.die();
    this.base();
  },
  radioButtonIndexValue: false,
  radioButtonResponder: false,
  setEnabled: function(_state){
    this.base(_state);
    if(!this['listItemViews']){ return; }
    for(var i=0;i<this.listItems.length;i++){
      this.listItemViews[i].setEnabled(_state);
    }
  },

/** = Description
  * RadioButtonIndexResponder sets the value based on which radiobutton is selected.
  **/
  RadioButtonIndexResponder: HValueResponder.extend({
    constructor: function( _parent, _valueObj ){
      this.parent = _parent;
    },
    refresh: function(){
      if( this.value === -1 ){
        return;
      }
      var
      _listItems = this.parent.listItems,
      _value;
      if(_listItems === undefined || _listItems === null){
        return;
      }
      if(_listItems[ this.value ] !== undefined){
        _value = _listItems[ this.value ];
        if( this.parent.value !== _value[0] ){
          this.parent.setValue( _value[0] );
        }
      }
    }
  }),



  refreshValue: function(){
    var _value = this.value;
    if ( this.listItems && this.listItems.length !== 0 && this.valueMatrix !== undefined ) {
      if ( this.radioButtonResponder === false ){
        this.radioButtonIndexValue = HValue.nu( false, 0 );
        this.radioButtonIndexValue.bind( this.valueMatrix );
        this.radioButtonResponder = this.RadioButtonIndexResponder.nu( this );
        this.radioButtonIndexValue.bind( this.radioButtonResponder );
      }
      for ( var i = 0; i < this.listItems.length; i++ ) {
        if ( this.listItems[i][0] === _value ) {
            this.radioButtonResponder.setValue( -1 );
            this.radioButtonResponder.setValue( i );
          break;
        }
      }
    }
  }
});

var//RSence.Lists
HRadiobuttonList = HRadioButtonList;


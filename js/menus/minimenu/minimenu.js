
/*** = Description
  ** Simple small menu component for selecting one value amongst several.
  ** It's limited to 15px height by the default theme.
  ***/
var//RSence.Menus
HMiniMenu = HRadioButtonList.extend({

  componentName: 'minimenu',

  defaultEvents: {
    draggable: true,
    mouseUp: true,
    click: true,
    resize: true
  },

  markupElemNames: [ 'bg', 'control', 'label' ],

  controlDefaults: HRadioButtonList.prototype.controlDefaults.extend({
    itemStyle: {
      'background-color': '#f6f6f6',
      'border': '1px solid #999',
      'overflow': 'auto',
      'overflow-x': 'hidden',
      'display': 'none',
      'opacity': 1
    }
  }),

  subComponentHeight: 15,

  resize: function(){
    this.repositionMenuItems();
  },

  repositionMenuItems: function(){
    var
    x = this.pageX(),
    y = this.pageY(),
    w = this.rect.width,
    _listItems = this.listItems ? (this.listItems.length ? this.listItems : {length:0} ) : {length:0},
    h = _listItems.length*this.subComponentHeight,
    i = 0;
    y -= this.rect.height;
    y -= (i-1)*this.subComponentHeight;
    if(y < 0){
      y = this.subComponentHeight%y;
    }
    if(this.options.menuItemGeom){
      if(this.options.menuItemGeom.width){
        w += this.options.menuItemGeom.width;
      }
      if(this.options.menuItemGeom.width){
        x += this.options.menuItemGeom.left;
      }
    }
    var
    mw = x+w,
    mh = y+h;
    this._menuItemViewShowPos = [ x, y ];
    this._menuItemViewHidePos = [ 0-mw, 0-mh ];
    this.menuItemView.rect.set( x, y, mw, mh );
    this.menuItemView.offsetTo( 0-mw, 0-mh );
    this.menuItemView.refresh();
    this.menuItemView.hide();
  },

  click: function(){
    if(!this.active){return false;}
    if( !this._menuShown || this._menuShowTime+500 > this.msNow() ) {
      this.menuShow();
    }
    else{
      this.menuHide();
    }
    return false;
  },

  refreshValue: function(){
    this.base();
    if(this.listItems && this.listItems.length !== 0 && this.valueMatrix !== undefined ) {
      for(var i=0;i<this.listItems.length;i++){
        if(this.typeChr(this.listItems[i]) === 'a'){
          if(this.listItems[i][0]===this.value){
            this.setLabel( this.listItems[i][1] );
            return;
          }
        }
        else {
          if(this.listItems[i].value===this.value){
            this.setLabel( this.listItems[i].value );
            return;
          }
        }
      }
    }
  },

  _menuShowTime: 0,
  _menuShown: false,
  menuShow: function(){
    if(this._menuShown){
      return false;
    }
    this._menuShown = true;
    this._menuShowTime = this.msNow();
    this.repositionMenuItems();
    if( this._menuItemViewShowPos ){
      var m = this._menuItemViewShowPos, x=m[0], y=m[1];
      this.menuItemView.offsetTo( x, y );
    }
    this.menuItemView.bringToFront();
    var _menu = this;
    this.pushTask( function(){
      _menu._hideElemId = ELEM.make( 0 );
      ELEM.setStyles( _menu._hideElemId, {
        position: 'absolute', left: 0, top: 0, right: 0, bottom: 0//, backgroundColor: '#000', opacity: 0.2
      } );
      Event.observe( ELEM.get( _menu._hideElemId ), 'mousedown', function(e){_menu.menuHide();_menu.pushTask(function(){EVENT.mouseDown(e);});return true;} );
      ELEM.setStyle( _menu._hideElemId, 'zIndex', ELEM.getStyle(_menu.menuItemView.elemId,'z-index')-1 );
    } );
    this.menuItemView.show();
    return true;
  },

  menuHide: function(){
    if( this._hideElemId ) {
      ELEM.del( this._hideElemId );
      this._hideElemId = null;
      delete this._hideElemId;
    }
    this._menuShown = false;
    this._menuShowTime = 0;
    if( this.menuItemView ){
      if( this._menuItemViewHidePos ){
        var m = this._menuItemViewHidePos, x=m[0], y=m[1];
        this.menuItemView.offsetTo( x, y );
      }
      this.menuItemView.sendToBack();
      this.menuItemView.hide();
    }
  },

  startDrag: function(x,y){
    this.dragStart = [x,y,this.msNow()];
    if(!this.active){return false;}
    this.menuShow();
    return false;
  },

  lostActiveStatus: function(_newActive){
    if( _newActive && !_newActive.isChildOf( this.menuItemView ) ){
      this.menuHide();
    }
    this.base(_newActive);
  },

  gainedActiveStatus: function(_prevActive){
    if( _prevActive && _prevActive.isChildOf( this.menuItemView ) ){
      this.menuHide();
    }
    this.base(_prevActive);
  },

  endDrag: function(x,y){
    if(((Math.round(this.dragStart[0]*0.2)===Math.round(x*0.2)) &&
        (Math.round(this.dragStart[1]*0.2)===Math.round(y*0.2)))
    ){
      this.menuShow();
    }
    else {
      this.menuHide();
    }
    return false;
  },

  die: function(){
    if( this._hideElemId ) {
      ELEM.del( this._hideElemId );
      this._hideElemId = null;
      delete this._hideElemId;
    }
    this.valueMatrix = null;
    var _menuItemView = this.menuItemView;
    this.base();
    if( _menuItemView ){
      _menuItemView.die();
    }
  },
  menuItemViewRect: function(){
    return [ 0-this.rect.width, 0-this.rect.height, this.rect.width, 10 ];
  },
  drawSubviews: function(){
    this.menuItemView = HView.nu(
      // [ this.rect.left, this.rect.top, this.rect.width, 10 ],
      this.menuItemViewRect(),
      this.app, {
        visible: false,
        style: this.options.itemStyle,
        logicParent: this
      }
    );
  },

  setListItems: function(_listItems){
    this.base(_listItems);
    this.valueMatrix = this.menuItemView.valueMatrix;
    this.refreshValue();
    if( this.options.initialVisibility ){
      EVENT.changeActiveControl(null);
      this.menuShow();
    }
  },

  createComponent: function( i, _label ){
    return HMiniMenuItem.nu(
      [ 0, (i*this.subComponentHeight), null, this.subComponentHeight, 0, null ],
      this.menuItemView, {
        label: _label
      }
    );
  }

});


/*** = Description
  ** HSheet is a container component that toggles its visibility
  ** based on its value. When the value is 0, it's visible, otherwise
  ** it's hidden. It expands to fill its parent view.
  **
  ** Its rect specifies the relative size and position of the centered inner
  ** sheet, which acts as a subview.
  **
  ** It's practical when combined with button values.
  **
  ** Also see HAlertSheet and HConfirmSheet components.
  **
  ***/
var//RSence.Controls
HSheet = HControl.extend({

  componentName: 'sheet',

  defaultEvents: {
    resize: true
  },

/** = Description
  * Shows of hides HSheet depending on the value.
  * If the value is 0 the HSheet#show() will be called.
  * Otherwise HSheet#hide() is called.
  *
  **/
  refreshValue: function(){
    if(this.value===0){
      this.show();
    }
    else{
      this.hide();
    }
  },

/** = Description
  * Draws the sheet rectangle once it has been created and
  * if it has not been set as hidden by constructor.
  *
  * = Returns
  * +self+
  **/
  // drawRect: function() {
  //   if (this.parent && this.rect.isValid) {
  //     var
  //     _this = this,
  //     _elemId = _this.elemId,
  //     _rect = _this.rect,
  //     _width = _rect.width,
  //     _top = _rect.top,
  //     _left = 0-Math.floor(_rect.width/2)+_rect.left,
  //     _height = _rect.height,
  //     _styles = [
  //       'left', '0px',
  //       'top', '0px',
  //       'right', '0px',
  //       'bottom', '0px',
  //       'width', 'auto',
  //       'height', 'auto',
  //       'min-width', _width+'px',
  //       'min-height', _height+'px'
  //     ],
  //     i = 0, _len;
  //     for( _len = _styles.length; i < _len; i+=2 ){
  //       ELEM.setStyle( _elemId, _styles[i], _styles[i+1] );
  //     }
  //     if(_this['markupElemIds']){
  //       var _stateId = _this.markupElemIds['state'];
  //       _styles = [
  //         'left', _left+'px',
  //         'top', _top+'px',
  //         'width', _width+'px',
  //         'height', _height+'px'
  //       ];
  //       i = 0;
  //       for( _len = _styles.length; i < _len; i+=2 ){
  //         ELEM.setStyle( _stateId, _styles[i], _styles[i+1] );
  //       }
  //     }
  //     //-- Show the rectangle once it gets created, unless visibility was set to++
  //     //-- hidden in the constructor.++
  //     if(undefined === _this.isHidden || _this.isHidden === false) {
  //       ELEM.setStyle( _elemId, 'visibility', 'inherit');
  //     }
  //     ELEM.setStyle( _elemId, 'display', 'block');
  //     _this._updateZIndex();
  //     _this.drawn = true;
  //   }
  //   return this;
  // },

  drawSubviews: function(){
    this.setStyle('overflow','visible');
    // var _dimmerElem = ELEM.make(this.elemId);
    // ELEM.addClassName( _dimmerElem, 'sheet_dimmer' );
    // this._dimmerElem = _dimmerElem;
    this.centerRect();
  },

  // die: function(){
  //   ELEM.del( this._dimmerElem );
  //   this.base();
  // },
  markupElemNames: [ 'dimmer', 'state', 'subview', 'bg' ],

  centerRect: function(){
    // console.log('centerRect');

    // console.log('parentSize:',ELEM.getVisibleSize( this.parent.elemId ));
    var
    _parentElemId = this.parent.elemId,
    _parentSize = _parentElemId===0?ELEM.windowSize():ELEM.getVisibleSize( this.parent.elemId ),
    _parentWidth = _parentSize[0],
    _parentHeight = _parentSize[1],
    _rect = this.rect,
    _centerLeft = Math.round((_parentWidth*0.5)-(_rect.width*0.5)),
    _centerTop = 0,//Math.round(_parentHeight/2-_rect.height/2);
    _dimmerLeft = 0-_centerLeft,
    _dimmerTop = 0-_centerTop;
    this.rect.offsetTo( _centerLeft, _centerTop );
    this.drawRect();
    this.setStyleOfPart('dimmer','left',_dimmerLeft+'px');
    this.setStyleOfPart('dimmer','top',_dimmerTop+'px');
    this.setStyleOfPart('dimmer','width',_parentWidth+'px');
    this.setStyleOfPart('dimmer','height',_parentHeight+'px');
    // console.log('zIndex:',ELEM.getStyle(this.elemId,'zIndex',true));
    // ELEM.setStyle(this._dimmerElem,'zIndex',ELEM.getStyle(this.elemId,'zIndex')-1);
  },

  resize: function(){
    this.centerRect();
    this.base();
  }

});


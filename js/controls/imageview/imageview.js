
/*** = Description
  ** HImageView is a control unit intended to display images on the screen
  ** through the HTML <IMG> tag. The HImageView class is a container
  ** to visualize
  ** images loaded via URL. It supports scaling via two class methods,
  ** scaleToFit and scaleToOriginal. If the image is unable to be loaded,
  ** a default blank image will be rendered.
  **
  ***/
var//RSence.Controls
HImageView = HControl.extend({

  getImgSrc: function(){
    var _value = (this.value!==null)?this.value:(this.options.valueObj?this.options.valueObj.value:this.options.value);
    if (!_value){
      _value = this.getThemeGfxFile("blank.gif");
    }
    return _value;
  },

  controlDefaults: HControlDefaults.extend({
    scaleToFit: true,
    value: null
  }),

  _makeScaleToFit: function(_parentId){
    this.elemId = ELEM.make( _parentId, 'img', {
      attrs: [
        [ 'src',   this.getImgSrc() ],
        [ 'alt',   this.label ],
        [ 'title', this.label ]
      ]
    } );
  },
  _makeScaleToOriginal: function(_parentId){
    this.elemId = ELEM.make(_parentId,'div');
    ELEM.setStyle(this.elemId,'background-image','url('+this.getImgSrc()+')');
    ELEM.setStyle(this.elemId,'background-position','0px 0px');
    ELEM.setStyle(this.elemId,'background-repeat','no-repeat');
    ELEM.setAttr(this.elemId,'title',this.label);
  },
  _makeElem: function(_parentId){
    if(this.options.scaleToFit){
      this._makeScaleToFit(_parentId);
    }
    else {
      this._makeScaleToOriginal(_parentId);
    }
  },

/** = Description
  * Used to refresh HImageView if the this.value is changed.
  *
  **/
  refreshValue: function(){
    var _src = this.getImgSrc();
    if(this.options.scaleToFit){
      if(ELEM.getAttr(this.elemId,'src')!==_src){
        ELEM.setAttr(this.elemId,'src',_src);
      }
    }
    else{
      var _url = 'url('+this.getImgSrc()+')';
      if(ELEM.getStyle(this.elemId,'background-image') != _url){
        ELEM.setStyle(this.elemId,'background-image',_url);
      }
    }
  },

/** = Description
  * Refreshesh the label of HImageView.
  *
  **/
  refreshLabel: function(){
    if(this.options.scaleToFit){
      ELEM.setAttr(this.elemId,'alt',this.label);
    }
    ELEM.setAttr(this.elemId,'title',this.label);
  },

/** = Description
  * Changes the size of the image element so that it fits in the rectangle of
  * the view.
  *
  **/
  scaleToFit: function() {
    if(!this.options.scaleToFit){
      ELEM.del(this.elemId);
      this._makeScaleToFit(this._getParentElemId());
      this.options.scaleToFit=true;
    }
  },


/** = Description
  * Resizes the image element to its original dimesions. If the image is larger
  * than the rectangle of this view, clipping will occur.
  *
  **/
  scaleToOriginal: function() {
    if(this.options.scaleToFit){
      ELEM.del(this.elemId);
      this._makeScaleToOriginal(this._getParentElemId());
      this.options.scaleToFit=false;
    }
  }



});

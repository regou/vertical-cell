(function(window, module, define) {
    'use strict';
    var context=function(require){

        var verticalCell=function(conf){
            /*
             css示例：
             .rotate_th_face{
                color: rgba(0,0,0,0);
                overflow: hidden;
             }
             .rotate_th_mask{
                @include origin(0,0);
                @include rotate(-90deg);
             }
             .rotate_th_inner{
                text-align: left;
             }
             */


            var self=this;
            var container=conf['container'];
            var selector =conf['selector'] || 'th';
            var cellClass=conf['cellClass'] || 'rotate_th';
            var call     =conf['call'] || {'mask':function(){},'face':function(){}};

            if(container.length<=0){return false;}
            container.css({position:'relative'});

            var masksStorge=[];
            var faces=null;


            var postProcess = function(face,mask,index){
                var isFunc=function(f){ if(typeof(f)==="function"){return true;}else{return false;} }
                if(isFunc(call.mask)){
                    call.mask(mask,index);
                }
                if(isFunc(call.face)){
                    call.face(face,index);
                }
            };

            self.genMasks=function(){
                var thMasks=[];
                faces=container.find(selector);
                faces.map(function(index,face){
                    var $face=$(face);
                    var mask=document.createElement('div');
                    var $mask=$(mask);

                    $face.addClass(cellClass+'_face');
                    var pos=$face.position();
                    var boxSize={
                        width:face.clientWidth,
                        height:face.clientHeight
                    };

                    $mask.css({
                        position:'absolute',
                        top:(pos.top+boxSize.height)+"px",
                        left:pos.left+"px",
                        width:boxSize.height+"px",//swap height&width
                        height:boxSize.width+"px",
                        display:"table"
                    });
                    $mask.addClass(cellClass+'_mask');
                    var innerDiv=document.createElement('div');
                    $(innerDiv)
                        .addClass(cellClass+'_inner')
                        .css({
                            'display':"table-cell",
                            'verticalAlign':"middle"
                        })
                        .html($face.html());

                    $mask.append(innerDiv);//还在内存中
                    thMasks[index]=mask;

                    postProcess(face,mask,index);

                });
                return thMasks;
            };

            self.remove=function(){
                if(masksStorge.length){
                    for(var _i= 0;_i<=masksStorge.length;_i++){
                        if(masksStorge[_i]){
                            $(masksStorge[_i]).remove();
                        }

                    }
                }
                masksStorge=[];
                if(faces){
                    faces.removeClass(cellClass+'_face');
                }
            };
            self.update=function(){
                self.remove();
                masksStorge=self.genMasks();
                if(masksStorge.length){
                    for(var _i= 0;_i<=masksStorge.length;_i++){
                        if(masksStorge[_i]){
                            container.append(masksStorge[_i]);
                        }

                    }
                }
            }
        };




        return verticalCell;
    };

    if(module){module.exports=context(require);}else if(define){define(context);}else{ window.verticalCell=context();}
})(typeof window !== "undefined" ? window : {}, typeof module !== "undefined" && module.exports? module:null, typeof define === 'function'?define:null );

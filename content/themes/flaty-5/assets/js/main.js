/*  TABLE OF CONTENT
    1. Common function
    2. Initialing
*/
/*================================================================*/
/*  1. Common function
/*================================================================*/
function path(){
    var args = arguments,result = [];
    for(var i = 0; i < args.length; i++)
        result.push(args[i].replace('@', '/assets/js/syntaxhighlighter/'));
    return result;
};
var sfApp={
    tags_list: [],
    reformatPost:function(){
        if($('.post').length){
            $('.post:not(.formated)').each(function() {                
                if($(this).find('.post-media').has('img').length){
                    var $postMedia=$('.post-media',$(this));
                    var $postImg=$postMedia.find('img');
                    var postUrl=$(this).find('.post-title a').attr('href');
                    var maskStr='<div class="mask">\
                                    <a class="preview magnific-popup" href="'+$postImg.attr('src')+'">\
                                        <i class="fa fa-search"></i>\
                                    </a>\
                                    <a class="detail" href="'+postUrl+'">\
                                        <i class="fa fa-link"></i>\
                                    </a>\
                                </div>';
                    $postMedia.append(maskStr);
                }
                else if($(this).find('.post-content').has('img').length){
                    var imgs=$(this).find('.post-content').find('img');
                    $.each(imgs, function(i, item) {
                        var $item=$(item);
                        var wrapClass='post-photo';
                        var alt = $item.attr( 'alt' );
                        if( alt.indexOf( 'alignright' ) >=0 ) {
                            wrapClass += ' alignright';
                        }
                        if( alt.indexOf( 'alignleft' ) >=0 ) {
                            wrapClass += ' alignleft';
                        }
                        if( alt.indexOf( 'aligncenter' ) >=0 ) {
                            wrapClass += ' aligncenter';
                        }
                        $item.replaceWith('<div class="' + wrapClass + '">\
                                <img src="'+$item.attr('src')+'" alt=""/>\
                                <div class="mask">\
                                    <a class="preview magnific-popup" href="'+$item.attr('src')+'">\
                                        <i class="fa fa-search"></i>\
                                    </a>\
                                </div>\
                            </div>');
                    });
                }
                $(this).addClass('formated');
            });
            $('.mask .magnific-popup').magnificPopup({
                type: 'image',
                closeOnContentClick: true,
                mainClass: 'mfp-img-mobile',
                image: {
                    verticalFit: true
                }
            });
        }
    },
    getAuthorInfo:function(){
        if($('#author-info').length && $('.widget.about-me').length){
            if($('#author-info').data('author-image') && $('#author-info').data('author-image')!=''){
                $('.widget.about-me .flip .front .avatar').html('<img src="'+$('#author-info').data('author-image')+'" alt=""/>');
            }
            if($('#author-info').data('author-name') && $('#author-info').data('author-name')!=''){
                $('.widget.about-me .flip .front .info .name').html($('#author-info').data('author-name'));
            }
            if($('#author-info').data('author-bio') && $('#author-info').data('author-bio')!=''){
                $('.widget.about-me .flip .front .info .bio').html($('#author-info').data('author-bio'));
            }
            $('.widget.about-me .flip .front').imagesLoaded(function() {
                var height=$('.widget.about-me .flip .front .avatar').height()+$('.widget.about-me .flip .front .info').height()+35;
                $('.widget.about-me .widget-content .flip-container .flip').css('height', height+'px');
            });
            $(document).on('click', '.flip-detail', function(event) {
                $(".widget.about-me .flip-container .flip").flippy({
                    direction: "right",
                    duration: "400",
                    verso: $('.widget.about-me .flip-data').html()
                });
                event.preventDefault();
            });
            $(document).on('click', '.flip-back', function(event) {
                $(".widget.about-me .flip-container .flip").flippyReverse();
                event.preventDefault();
            });
        }
    },
    widgetEvents:function(){
        if($('.recent-posts').length){
            $('.recent-posts').each(function(){
                var $this=$(this);
                var showPubDate=false;
                var showDesc=false;
                var descCharacterLimit=70;
                var size=-1;
                var type='static';
                var slideMode='horizontal';
                var slideSpeed=500;
                var slidePager=false;
                var isTicker=false;
                var monthName=new Array();
                monthName[0]="Jan";
                monthName[1]="Feb";
                monthName[2]="Mar";
                monthName[3]="Apr";
                monthName[4]="May";
                monthName[5]="June";
                monthName[6]="July";
                monthName[7]="Aug";
                monthName[8]="Sept";
                monthName[9]="Oct";
                monthName[10]="Nov";
                monthName[11]="Dec";
                if($this.data('pubdate'))
                    showPubDate=$this.data('pubdate');
                if($this.data('desc')){
                    showDesc=$this.data('desc');
                    if($this.data('character-limit'))
                        descCharacterLimit=$this.data('character-limit');
                }
                if($this.data('size'))
                    size=$this.data('size');
                if($this.data('type'))
                    type=$this.data('type');
                if(type==='scroll'){
                    if($this.data('mode'))
                        slideMode=$this.data('mode');
                    if($this.data('speed'))
                        slideSpeed=$this.data('speed');
                    if($this.data('pager'))
                        slidePager=$this.data('pager');
                    if($this.data('ticker'))
                        isTicker=$this.data('ticker');
                }
                $.ajax({
                    type: 'GET',
                    url: rootUrl+'/rss/',
                    dataType: "xml",
                    success: function(xml) {
                        if($(xml).length){                            
                            var htmlStr='';
                            var date;
                            var count=0;
                            $('item', xml).each( function() {
                                if(size>0 && count < size){
                                    htmlStr+='<li class="clearfix">';
                                    if(showPubDate){
                                        date = new Date($(this).find('pubDate').eq(0).text());
                                        htmlStr += '<span class="itemDate">\
                                                        <span class="date">'+date.getDate()+'</span>\
                                                        <span class="month">'+monthName[date.getMonth()]+'</span>\
                                                    </span>';
                                    }
                                    htmlStr+='<span class="itemContent">';
                                    htmlStr += '<span class="title">\
                                                        <a href="' + $(this).find('link').eq(0).text() + '">\
                                                        ' + $(this).find('title').eq(0).text() + '\
                                                        </a>\
                                                </span>';
                                    if (showDesc) {
                                        var desc=$(this).find('description').eq(0).text();
                                        // trip html tag
                                        desc=$(desc).text();
                                        if (descCharacterLimit > 0 && desc.length > descCharacterLimit) {
                                            htmlStr += '<span class="desc">' + desc.substr(0, descCharacterLimit) + ' ...\
                                                            <a href="'+$(this).find('link').eq(0).text()+'">View »</a>\
                                                        </span>';
                                        }
                                        else{
                                            htmlStr += '<span class="desc">' + desc + "</span>";
                                        }
                                    }
                                    htmlStr+='</span>';
                                    htmlStr += '</li>';
                                    count++;
                                }
                                else{
                                    return false;
                                }
                            });
                            if(type==='static')
                                htmlStr='<ul class="feedList static">'+ htmlStr + "</ul>";
                            else{
                                htmlStr='<ul class="feedList bxslider">'+ htmlStr + "</ul>";
                            }
                            $this.append(htmlStr);
                            if(type!=='static'){
                                // Updating on v1.2
                            }
                        }
                    }
                });
            });
        }
        if( $('.flickr-feed').length ){
            $('.flickr-feed').each(function() {
                var flickr_id='';
                if($(this).data('user-id')){
                    flickr_id=$(this).data('user-id');
                }
                if(flickr_id==''){
                    $(this).html('<li><strong>Please enter Flickr user id before use this widget</strong></li>');
                }
                else{
                    var feedTemplate='<li><a href="{{image_b}}" target="_blank"><img src="{{image_m}}" alt="{{title}}" /></a></li>';
                    var size=15;
                    if($(this).data('size'))
                        size=$(this).data('size');
                    var isPopupPreview=false;
                    if($(this).data('popup-preview'))
                        isPopupPreview=$(this).data('popup-preview');
                    if(isPopupPreview){
                        feedTemplate='<li><a href="{{image_b}}"><img src="{{image_m}}" alt="{{title}}" /></a></li>';
                    }
                    $(this).jflickrfeed({
                        limit: size,
                        qstrings: {
                            id: flickr_id
                        },
                        itemTemplate: feedTemplate
                    }, function(data) {
                        if(isPopupPreview){
                            $(this).magnificPopup({
                                delegate: 'a',
                                type: 'image',
                                closeOnContentClick: false,
                                closeBtnInside: false,
                                mainClass: 'mfp-with-zoom mfp-img-mobile',
                                gallery: {
                                    enabled: true,
                                    navigateByImgClick: true,
                                    preload: [0,1] // Will preload 0 - before current, and 1 after the current image
                                },
                                image: {
                                    verticalFit: true,
                                    tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
                                }
                            });
                        }
                    });
                }
            });
        }
        if($('.dribbble-feed').length && $.jribbble ){
            $('.dribbble-feed').each(function(){
                var $this=$(this);
                var userId='';
                if($this.data('userid')){
                    userId = $this.data('userid');
                }
                if( userId != '' ){                    
                    var display=15;
                    if($this.data('display'))
                        display=$this.data('display');
                    var isPopupPreview=false;
                    if($this.data('popup-preview'))
                        isPopupPreview=$this.data('popup-preview');
                    $.jribbble.getShotsByPlayerId(userId, function (listDetails) {                        
                        var html = [];
                        $.each(listDetails.shots, function (i, shot) {
                            html.push('<li><a href="' + shot.url + '"><img src="' + shot.image_teaser_url + '" alt="' + shot.title + '"></a></li>');
                        });
                        $this.html(html.join(''));                          
                        if(isPopupPreview){
                            $this.magnificPopup({
                                delegate: 'a',
                                type: 'image',
                                tLoading: 'Loading image #%curr%...',
                                closeOnContentClick: true,
                                closeBtnInside: false,
                                fixedContentPos: true,
                                mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
                                image: {
                                    verticalFit: true,
                                    tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
                                },
                                gallery: {
                                    enabled: true,
                                    navigateByImgClick: true,
                                    preload: [0,1] // Will preload 0 - before current, and 1 after the current image
                                }
                            });
                        }
                    }, {page: 1, per_page: display});
                }
                
            });
        }
        if( $( '.instagram-feed' ).length && $.fn.spectragram ) {            
            $( '.instagram-feed' ).each(function(){
                var $this=$(this);
                if( $this.data( 'userid' ) != '' && $this.data( 'api-token' ) != '' && $this.data( 'api-clientid' ) != '' ) {
                    $.fn.spectragram.accessData = {
                        accessToken: $this.data('api-token'),
                        clientID: $this.data('api-clientid')
                    };
                    var display=15;
                    var wrapEachWithStr='<li></li>';
                    if($(this).data('display'))
                        display=$(this).data('display');
                    $(this).spectragram('getUserFeed',{
                        query: $this.data( 'userid' ),
                        max: display
                    });
                }
                else{
                    $(this).html('<li><strong>Please change instagram api access info before use this widget</strong></li>');
                }
            });
        }        
        if($('.sf-tags').length){               
            $('.sf-tags').each(function(){
                var $this = $(this);
                if(! sfApp.tags_list.length){
                    var page = 0;               
                    var maxPage = 0;                        
                    $.ajax({
                        type: 'GET',
                        url: rootUrl,
                        success: function(response){
                            var $response=$(response);
                            var postPerPage = $response.find('.post-list .post').length; 
                            var totalPage=1;
                            var numberPattern = /\d+/g;                            
                            var pageNumberStr = $response.find('.page-number').html();
                            var regResult = pageNumberStr.match( numberPattern );
                            console.log(regResult);
                            if(regResult!=null && regResult.length>1){
                                totalPage = regResult[1];
                            }                            
                            maxPage=Math.floor( ( postPerPage * totalPage ) / 15 ) +1 ;                                       
                            var timeout = setInterval(function(){
                                page = page + 1;                
                                var ajaxUrl = rootUrl+'/rss/'+page+'/';
                                if(page==1){
                                    ajaxUrl=rootUrl+'/rss/';
                                } 
                                if( page > maxPage ) {
                                    clearInterval(timeout);     
                                    sfApp.fillTagData($this);                            
                                }
                                else{                                                                          
                                    $.ajax({
                                        type: 'GET',
                                        url: ajaxUrl,
                                        dataType: 'xml',
                                        success: function(xml) {
                                            if($(xml).length){                                                           
                                                $('item', xml).each( function() {                                                                                                       
                                                    if( $(this).find('category').length ){
                                                        $(this).find('category').each( function() { 
                                                            var tag = $(this).text();
                                                            if ( '_full_width' !== tag && '_left_sidebar' !== tag && '_right_sidebar' !== tag && '_both_sidebar' !== tag  && '_full_cover' !== tag ) {
                                                                var tagOj= {'tagName': tag,'total': 1};
                                                                var hasOld=false;
                                                                for(var i = 0; i < sfApp.tags_list.length; i++){
                                                                    if(tag === sfApp.tags_list[i].tagName){
                                                                        tagOj.total=sfApp.tags_list[i].total+1;
                                                                        sfApp.tags_list[i]=tagOj;
                                                                        hasOld=true;
                                                                        break;
                                                                    }
                                                                }
                                                                if(!hasOld){
                                                                    sfApp.tags_list.push(tagOj);                                                                    
                                                                }
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    });   
                                }             
                            }, 1000); 
                        }
                    }); 
                }
                else{
                    sfApp.fillTagData($this);
                }
            });
        }
        if($('.newsletter-form').length){
            $('.newsletter-form').each(function(){
                var $this = $(this);
                $('input', $this).not('[type=submit]').jqBootstrapValidation({
                    submitSuccess: function ($form, event) {                                       
                        event.preventDefault();                                            
                        var url=$form.attr('action');
                        if(url=='' || url=='YOUR_WEB_FORM_URL_HERE'){
                            alert('Please config your mailchimp form url for this widget');
                            return false;
                        }
                        else{
                            url=url.replace('/post?', '/post-json?').concat('&c=?');
                            var data = {};
                            var dataArray = $form.serializeArray();
                            $.each(dataArray, function (index, item) {
                                data[item.name] = item.value;
                            });
                            $.ajax({
                                url: url,
                                data: data,
                                success: function(resp){                                         
                                    if ( 'success' !== resp.result ) { 
                                        $this.find( '.alert .alert-title').html('Error');                                        
                                        $this.find( '.alert').addClass('alert-danger');  
                                    }
                                    $this.find( '.alert .alert-text' ).html( resp.msg );
                                    $this.find('.alert').fadeIn();
                                },
                                dataType: 'jsonp',
                                error: function (resp, text) {
                                    console.log('mailchimp ajax submit error: ' + text);
                                }
                            });
                            return false;
                        }
                        return false;
                    }
                });
            });            
        }
        if( $( '.sf-fb-like-box' ).length ){
            $( '.sf-fb-like-box' ).each(function(){
                var page_url = '';
                if( $(this).data('pageurl') ){
                    page_url = $(this).data('pageurl');                     
                }
                if( '' !== page_url ){
                    var color_scheme = 'light';
                    var $maybe_footer = $(this).closest('.widget-area-wrap');
                    if( $maybe_footer.length && !$('body').is('.dark') ){
                        color_scheme = 'dark';
                    }
                    var htmlStr = '<iframe src="//www.facebook.com/plugins/likebox.php?href=' + page_url + '&amp;width&amp;height=258&amp;colorscheme=' + color_scheme + '&amp;show_faces=true&amp;header=false&amp;stream=false&amp;show_border=false" scrolling="no" frameborder="0" style="border:none; overflow:hidden; height:258px; width:100%;" allowTransparency="true"></iframe>';
                    $(this).html( htmlStr );
                }
            });
        }  



        if($('.search-keyword-widget').length){
            $('.search-keyword-widget').keypress(function(event) { 
                var $this = $(this);                                    
                if (event.which == 13) {
                    doSearch($this);
                }
            });             
        }      
        $('.sf-widget-search-icon').click(function(){
            var $this = $(this); 
            if($this.is('.searched')){
                $this.removeClass('searched');
                $('.fa', $this).removeClass('fa-times');
                $('.fa', $this).addClass('fa-search');
                var $sf_search_widget = $(this).closest('.sf-search-widget');
                if( $sf_search_widget.length ){
                    var $search_result_wrap = $( '.search-result-widget-wrap', $sf_search_widget );
                    if( $search_result_wrap.length ){
                        $search_result_wrap.removeClass('scroll');
                    }
                    var $result_container = $( '.search-result-widget-wrap .search-result-widget-inner .search-result-widget', $sf_search_widget );
                    if( $result_container.length ){
                        $result_container.html('');
                        $result_container.removeClass('searching');                         
                    }
                }
            }else{
                doSearch($('.search-keyword-widget'));
            }

        }); 
        $('.banner-search-icon').click(function(){
            var $this = $(this); 
            if( $this.is('.searched') ){
                $this.removeClass('searched');
                $('.fa', $this).removeClass('fa-times');
                $('.fa', $this).addClass('fa-search');
                var $searchArea = $(this).closest('.search-area');
                if( $searchArea.length ){
                    $( '#search-keyword', $searchArea ).val('');
                    var $search_result_wrap = $( '.search-result-wrap', $searchArea );
                    if( $search_result_wrap.length ){
                        $search_result_wrap.removeClass('scroll');
                    }
                    var $result_container = $( '.search-result-inner .search-result', $search_result_wrap );
                    if( $result_container.length ){
                        $result_container.html('');
                        $result_container.removeClass('searching');                         
                    }
                }
            }               
        }); 
    },    
    getMaxPagination:function(){
        if($('.page-number').length){
            var numberPattern = /\d+/g;
            var pageNumberStr=$('.page-number').html();
            var result=pageNumberStr.match(numberPattern);
            if(result!=null && result.length>1){
                return result[1];
            }
            else{
                return 1;
            }
        }
    },
    isotopeSetup:function(){
        if($('body').is('.masonry') && $('.post-list').length){
            var $container = $('.post-list');
            $('.post').imagesLoaded(function() {
                $container.isotope({
                    itemSelector : '.item-list',
                    resizable: false,
                    animationOptions: {
                        duration: 400,
                        easing: 'swing',
                        queue: false
                    },
                    masonry: {}
                });
                sfApp.reloadIsotope();
            });
        }
    },    
    reloadIsotope:function(){
        if($('body').is('.masonry') && $('.post-list').length){
            sfApp.reformatPost();
            $('.post-list').isotope();
        }
    },
    fillTagData:function(element){
        if( $(element).length && sfApp.tags_list.length ) {
            var items = 10;
            if($(element).data('max-items')){
                items = $(element).data('max-items');
            }
            var count = 0;
            var htmlStr = '<ul>';
            $.each( sfApp.tags_list, function( index, tag ) {
                var tagLink = tag.tagName.toLowerCase().replace(/ /g, '-');
                htmlStr += '<li><a href="' + rootUrl + '/tag/' + tagLink + '"><span class="name">' + tag.tagName + '</span><span class="count">' + tag.total + '</span></a></li>';
                count++;
                if( count >= items ) {                      
                    return false;
                }
            });             
            htmlStr += '</ul>';
            $(element).html(htmlStr);
        }
    },
    searchEvents:function(){
        if($('.search-button').length){
            $('.search-button').click(function(){
                $('#search-keyword').val('');
                var $search=$('.search-container');                
                if(!$(this).is('.active')){
                    $('body').addClass('open-search');
                    $search.addClass('open');
                    $(this).addClass('active');                    
                }
                else{
                    $('body').removeClass('open-search');
                    $search.removeClass('open');
                    $(this).removeClass('active');
                    $('.search-result').removeClass('searching');                    
                }
            });
        }
        if($('#search-keyword').length){
            $('#search-keyword').keypress(function(event) {
                var $this = $(this);            
                if (event.which == 13) {
                    if( $this.val() !='' && $this.val().length>=3 ){                             
                        $('.search-result').html('<li class="loading-text">Searching ...</li>');
                        $('.search-result').addClass('searching');
                        $('.search-result-wrap').addClass('scroll');
                        if( $this.parent().is('.banner-search-form') ) {
                            var $bannerSearchForm = $this.parent();
                            var $searchIcon = $bannerSearchForm.find('.banner-search-icon');
                            if( $searchIcon.length ){
                                $searchIcon.addClass('searched');
                                $searchIcon.find('i').removeClass('fa-search');
                                $searchIcon.find('i').addClass('fa-times');
                            }
                        }
                        sfApp.search($this.val(), $('.search-result') );
                    }
                    else{
                        $('.search-result').html('<li class="loading-text">Please enter at least 3 characters!</li>');
                        $('.search-result').addClass('searching');
                    }
                }
            });
        }
    },
    search:function(keyword, container){
        var hasResult=false;
        var page = 0;
        var maxPage=0;        
        if(keyword != ''){                  
            $.ajax({
                type: 'GET',
                url: rootUrl,
                success: function(response){
                    var $response=$(response);
                    var postPerPage=$response.find('.post-list .row .post').length; 
                    var totalPage=parseInt($response.find('.total-page').html());
                    maxPage=Math.floor((postPerPage*totalPage)/15)+1;                                       
                    var timeout = setInterval(function(){
                        page=page+1;                
                        var ajaxUrl=rootUrl+'/rss/'+page+'/';
                        if(page==1){
                            ajaxUrl=rootUrl+'/rss/';
                        } 
                        if(page>maxPage){
                            clearInterval(timeout);
                            if(!hasResult){
                                if($('.loading-text', container).length){
                                    $('.loading-text', container).html('Apologies, but no results were found. Please try another keyword!');
                                }
                            }
                        }
                        else{                                                                          
                            $.ajax({
                                type: 'GET',
                                url: ajaxUrl,
                                dataType: "xml",
                                success: function(xml) {
                                    if($(xml).length){                                                           
                                        $('item', xml).each( function() {                                                                          
                                            if($(this).find('title').eq(0).text().toLowerCase().indexOf(keyword.toLowerCase())>=0 ||
                                                    $(this).find('description').eq(0).text().toLowerCase().indexOf(keyword.toLowerCase())>=0){
                                                hasResult=true;
                                                if($('.loading-text', container).length){
                                                    $('.loading-text',container).remove();
                                                }                                                   
                                                container.append('<li><a href="'+$(this).find('link').eq(0).text()+'">'+$(this).find('title').eq(0).text()+'</a></li>');
                                            }                    
                                        });
                                    }
                                }
                            });   
                        }             
                    }, 1000); 
                }
            });                                           
        }
    },
    fitVids:function(){
        $(".post .wrap").fitVids();
        $(".post").fitVids();
    },    
    syntaxHighlighter:function(){
        SyntaxHighlighter.autoloader.apply(null, path(
            'applescript            @shBrushAppleScript.js',
            'actionscript3 as3      @shBrushAS3.js',
            'bash shell             @shBrushBash.js',
            'coldfusion cf          @shBrushColdFusion.js',
            'cpp c                  @shBrushCpp.js',
            'c# c-sharp csharp      @shBrushCSharp.js',
            'css                    @shBrushCss.js',
            'delphi pascal          @shBrushDelphi.js',
            'diff patch pas         @shBrushDiff.js',
            'erl erlang             @shBrushErlang.js',
            'groovy                 @shBrushGroovy.js',
            'java                   @shBrushJava.js',
            'jfx javafx             @shBrushJavaFX.js',
            'js jscript javascript  @shBrushJScript.js',
            'perl pl                @shBrushPerl.js',
            'php                    @shBrushPhp.js',
            'text plain             @shBrushPlain.js',
            'py python              @shBrushPython.js',
            'powershell ps posh     @shBrushPowerShell.js',
            'ruby rails ror rb      @shBrushRuby.js',
            'sass scss              @shBrushSass.js',
            'scala                  @shBrushScala.js',
            'sql                    @shBrushSql.js',
            'vb vbnet               @shBrushVb.js',
            'xml xhtml xslt html    @shBrushXml.js'
        ));
        SyntaxHighlighter.all();
    },
    mainMenuEvents:function(){
        // Active Current Menu        
        var currentUrl=window.location.href;
        if(currentUrl.lastIndexOf('#')>0){
            currentUrl=currentUrl.substr(0,currentUrl.lastIndexOf('#'));
        }
        var $currentMenu=$('.main-nav a[href="'+currentUrl+'"]');
        if($currentMenu.length){
            $('.main-nav li.active').removeClass('active');
            $currentMenu.parent().addClass('active');
        }
        if( $('.main-nav').length ) {                              
            if( sfApp.isMobile() ){
                $('.main-nav li.has-children').click(function(e){                                        
                    $('.sub-menu:first', $(this) ).slideToggle();
                    if( !$(this).is( '.active' ) ){
                        $(this).addClass('active');
                    }
                    else{
                        $(this).removeClass('active');    
                    }
                });   
            }
            else{
                $('.main-nav li.has-children').hover(
                    function(){                                                                   
                        $('.sub-menu:first', $(this) ).fadeIn();
                        $(this).addClass('active');
                    },
                    function(){                        
                        $('.sub-menu:first', $(this) ).fadeOut();                        
                        $(this).removeClass('active');    
                    }
                );
            }            
        }
        $('.sf-nav-widget li.has-children > a').click(function(e){
            if( '#' === $( this ).attr('href') ){
                e.preventDefault(); 
            }                   
            var $parent = $(this).parent();
            $('.sub-menu:first', $parent ).slideToggle();
            if( !$parent.is( '.open' ) ){
                $parent.addClass('open');
            }
            else{
                $parent.removeClass('open');    
            }
        }); 
    },
    isMobile:function(){
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            return true;
        }
        else
            return false;
    },
    misc:function(){
        if($('body').data('infinite-scroll') && $('.post-list').length ){
            var $container = $('.post-list');
            if($('body').is('.masonry') ){
                $container.infinitescroll({
                        navSelector     : '.pagination',    // selector for the paged navigation
                        nextSelector    : '.pagination a',  // selector for the NEXT link (to page 2)
                        itemSelector    : '.item-list',     // selector for all items you'll retrieve
                        maxPage         : sfApp.getMaxPagination(),
                        extraScrollPx   : 150,
                        loading: {
                            finishedMsg: 'No more post to load.',
                            img: rootUrl+'/assets/img/loading.gif'
                        }
                    },
                    // call Isotope as a callback
                    function( newElements ) {
                        $container.isotope('appended', $(newElements),function(){
                            sfApp.reformatPost();
                            $(".post").fitVids();
                            sfApp.reloadIsotope();
                        });
                    }
                );
            }
            else{
                $container.infinitescroll({
                        navSelector     : '.pagination',    // selector for the paged navigation
                        nextSelector    : '.pagination a',  // selector for the NEXT link (to page 2)
                        itemSelector    : '.post',     // selector for all items you'll retrieve
                        maxPage           : sfApp.getMaxPagination(),
                        loading: {
                            finishedMsg: 'No more post to load.',
                            img: rootUrl+'/assets/img/loading.gif'
                        }
                    },
                    // call Isotope as a callback
                    function( newElements ) {                                            
                        $container.append($(newElements));
                        sfApp.reformatPost();
                        $(".post").fitVids();
                    }
                );
            }
        }  
        if( $('body').is('.header-style2') && $('#sf-sticker-content').length && $(window).width()>480 ) {
            $('#sf-sticker-content').ticker({
                htmlFeed: false,
                ajaxFeed: true,
                feedUrl: rootUrl+'/rss/',
                feedType: 'xml'
            });
        }
        if($('body').is('.header-style3') && $(window).width()<768){
            $('.main-nav').insertAfter( '.navbar-header' );
        }
        // BackToTop Button click event
        $('.totop-btn').click(function () {
            $("html, body").animate({scrollTop: 0}, 800);
            return false;
        });
        $('.go-to-comment').click(function(event) {
            $('html, body').stop().animate({scrollTop: $('.comment-wrap').offset().top}, 800);
        });
    },
    refreshUI:function(){
        sfApp.reloadIsotope();
    },
    uiInit:function(){
        sfApp.reformatPost();
        sfApp.isotopeSetup();
    },
    init: function () {
        sfApp.uiInit();        
        sfApp.fitVids();
        sfApp.getAuthorInfo();
        sfApp.syntaxHighlighter();
        sfApp.mainMenuEvents();
        sfApp.widgetEvents(); 
        sfApp.searchEvents();       
        sfApp.misc();
    }
};

/*================================================================*/
/*  2. Initialing
/*================================================================*/
$(document).ready(function() {
    sfApp.init();
});
$(window).resize(function () {
    "use strict";    
    if(this.resizeTO){
        clearTimeout(this.resizeTO);
    }  
    this.resizeTO = setTimeout(function() {
        $(this).trigger('resizeEnd');
    }, 500);
});
$(window).bind('resizeEnd', function() {
    "use strict";    
    sfApp.refreshUI();
});


/// custom


function doSearch (widget) {
    var $sf_search_widget = $(widget).closest('.sf-search-widget');
    if( $sf_search_widget.length ){
        var $result_container = $( '.search-result-widget-wrap .search-result-widget-inner .search-result-widget', $sf_search_widget );
        if( $result_container ){
            if( $this.val() !='' && $this.val().length>=3 ){                             
                $result_container.html('<li class="loading-text">Searching ...</li>');
                $result_container.addClass('searching');
                var $search_result_wrap = $result_container.closest('.search-result-widget-wrap');
                if( $search_result_wrap.length ){
                    $search_result_wrap.addClass('scroll');
                }                                   
                sfApp.search( $this.val(), $result_container );                                                    
            }
            else{
                $result_container.html('<li class="loading-text">Please enter at least 3 characters!</li>');
                $result_container.addClass('searching');
            }
            var $form_group = $this.closest('.form-group');
            if( $form_group.length ){
                var $icon = $('.sf-widget-search-icon', $form_group);   
                if( $icon.length ){
                    $( '.fa', $icon ).removeClass('fa-search');
                    $( '.fa', $icon ).addClass('fa-times');
                    $icon.addClass('searched');
                }
            }
        }
    }
}
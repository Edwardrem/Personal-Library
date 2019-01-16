$( document ).ready(function() {
  var items = [];
  var itemsRaw = [];
  
  $.getJSON('/api/books', function(data) {
    //var items = [];
    itemsRaw = data;
    $.each(data, function(i, val) {
      items.push('<li class="bookItem" id="' + i + '">' + val.book_title + ' - ' + val.commentCount + ' comments</li>');
      return ( i !== 14 );
    });
    if (items.length >= 15) {
      items.push('<p>...and '+ (data.length - 15)+' more!</p>');
    }
    $('<ul/>', {
      'class': 'listWrapper',
      html: items.join('')
      }).appendTo('#display');
  });
  
  var comments = [];
  $('#display').on('click','li.bookItem',function() {
    $("#detailTitle").html('<b>'+itemsRaw[this.id].book_title+'</b> (id: '+itemsRaw[this.id]._id+')');
    var formHTML = '<br><form id="newCommentForm"><input style="width:300px" type="text" class="form-control" name="_id" readonly="readonly" value=' + itemsRaw[this.id]._id + '><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>'
    $.getJSON('/api/books/'+itemsRaw[this.id]._id, function(data) {
      comments = [];
      $.each(data[0].comment, function(i, val) {
        comments.push('<li>' +val+ '</li>');
      });
      comments.push(formHTML);
      comments.push('<br><button class="btn btn-info addComment" id="'+ data[0]._id+'">Add Comment</button>');
      comments.push('<button class="btn btn-danger deleteBook" id="'+ data[0]._id+'">Delete Book</button>');
      $('#detailComments').html(comments.join(''));
    });
  });
  
  $('#bookDetail').on('click','button.deleteBook',function() {
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'delete',
      success: function(data) {
        //update list
        $('#detailComments').html('<p style="color: red;">'+data+'<p><p>Refresh the page</p>');
      }
    });
  });  
  
  $('#bookDetail').on('click','button.addComment',function() {
    var newComment = $('#commentToAdd').val();
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'post',
      dataType: 'text',
      data: $('#newCommentForm').serialize(),
      success: function(data) {
        comments.unshift('<li>' + newComment + '</li>'); //adds new comment to top of list
        $('#detailComments').html(comments.join(''));
      }
    });
  
  });
  
  $('#newBook').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        
        //update list
      }
    });
  });
  
  $('#deleteAllBooks').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        $('#detailComments').html('<p style="color: red;">'+data+'<p><p>Refresh the page</p>');
        //update list
      }
    });
  }); 
  
});
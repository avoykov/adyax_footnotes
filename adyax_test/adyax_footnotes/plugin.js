(function ($) {
  CKEDITOR.plugins.add('adyaxFootnotes', {
    init: function (editor) {
      CKEDITOR.dialog.add('adyaxFootnotesDialog', function (editor) {
        return {
          title: Drupal.t('Add footnote'),
          minWidth: 400,
          minHeight: 100,
          contents: [
            {
              id: 'footnoteForm',
              label: Drupal.t('Add a footnote'),
              title: Drupal.t('Add a footnote'),
              elements: [
                {
                  id: 'number',
                  type: 'text',
                  validate: CKEDITOR.dialog.validate.notEmpty( "Number cannot be empty." ),
                  label: Drupal.t('Number:'),
                  labelLayout: 'horizontal',
                  setup: function( element ) {
                    this.setValue( element.getText() );
                  }
                },
                {
                  type: 'textarea',
                  validate: CKEDITOR.dialog.validate.notEmpty( "Footnote cannot be empty." ),
                  id: 'footnote',
                  label: Drupal.t('Footnote:'),
                  'default': '',
                  setup: function( element ) {
                    this.setValue( element.getText() );
                  },
                }
              ]
            }
          ],
          onOk: function () {
            var editor = this.getParentEditor(),
                number = this.getValueOf('footnoteForm', 'number'),
                footnote = this.getValueOf('footnoteForm', 'footnote'),
                selected = editor.getSelection(),
                fragment = selected.getRanges()[0].extractContents(),
                list = editor.document.getById('af-list') || false;

            // Create footnote mark.
            //@todo may be btter to use drupal.theme or small js template tool?
            var elem = selected.getSelectedText() + '<sup id="afr-' + number + '">' +
                '<a href="#afn-' + number + '">[' + number + ']</a>' +
                '</sup>';
            var sup = new CKEDITOR.dom.element.createFromHtml(elem);

            // Insert it.
            editor.insertElement(sup);
            sup.insertBeforeMe(fragment);

            // If we don't have list of footnotes, create it.
            if (list === false) {
              var range = editor.createRange();
              range.moveToElementEditEnd(range.root);
              editor.getSelection().selectRanges([range]);
              list = new CKEDITOR.dom.element.createFromHtml('<ul id="af-list"></ul>');
              editor.insertElement(list);
            }

            // Create and insert list item.
            var html = '<li id="afn-' + number + '">' + '<a href="#afr-' + number + '" class="afr-item">#</a>' + number + ' - ' + footnote + '</li>';
            var footnoteElem = new CKEDITOR.dom.element.createFromHtml(html);
            list.append(footnoteElem);
          }
        };
      });

      editor.addCommand('adyaxFootnotesCommand', new CKEDITOR.dialogCommand('adyaxFootnotesDialog'));

      editor.ui.addButton('adyaxFootnotesButton', {
        label: Drupal.t('Add footnote'),
        command: 'adyaxFootnotesCommand',
        icon: this.path + 'images/footnote.jpg'

      });

      // Idea was to toggle button status in case when user select text.
      // But at this moment it works very strange, as
      editor.on('selectionChange', function (event) {
        var text = event.data.selection.getSelectedText(),
            editor = event.editor;
        if (text !== "") {
          debugger;
          editor.commands['adyaxFootnotesCommand'].setState(CKEDITOR.TRISTATE_ON)
        }
        else {
          editor.commands['adyaxFootnotesCommand'].setState(CKEDITOR.TRISTATE_DISABLED)
        }
      });

      // @todo Add context menu for adding possibility to edit.
    }
  });
})(jQuery);

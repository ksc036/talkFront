import { Quill } from 'react-quill';

const InlineEmbed = Quill.import('blots/embed');

class emoticon extends InlineEmbed {
  static create(data: any) {
    const node = super.create(data);
    node.setAttribute('alt', data.alt);
    node.setAttribute('data-src', data.src);
    node.setAttribute('src', data.src);
    node.setAttribute('data-alias', data.colons);
    node.setAttribute('width', '20px');
    node.setAttribute('style', 'margin-right:4px;');
    return node;
  }

  static value(domNode: any) {
    return {
      alt: domNode.getAttribute('alt'),
      src: domNode.getAttribute('src'),
      colons: domNode.getAttribute('data-alias'),
    };
  }
}

emoticon.blotName = 'emoticon';
emoticon.className = 'emoticon';
emoticon.tagName = 'img';
Quill.register(emoticon);

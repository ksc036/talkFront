import { Quill } from 'react-quill';

const InlineEmbed = Quill.import('blots/embed');

class mention extends InlineEmbed {
  static create(data: any) {
    const node = super.create(data.value);
    node.setAttribute('data-value', data.value);
    node.setAttribute('id', data.id);
    node.setAttribute('style', 'margin-right:4px;');
    node.innerHTML += '@';
    node.innerHTML += data.value;

    return node;
  }

  static value(domNode: any) {
    return {
      id: domNode.getAttribute('id'),
      value: domNode.getAttribute('data-value'),
    };
  }
}

mention.blotName = 'mention';
mention.className = 'mention';
mention.tagName = 'span';

Quill.register(mention);

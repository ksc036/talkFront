import { Quill } from 'react-quill';

const InlineEmbed = Quill.import('blots/embed');

class HyperLink extends InlineEmbed {
  static create(value: any) {
    const node = super.create();
    node.setAttribute('url', value.url);
    node.setAttribute('target', '_blank');
    node.innerHTML += value.text;

    return node;
  }

  static formats(value: any) {
    return value;
  }

  static value(node: any) {
    return {
      url: node.getAttribute('url'),
      text: node.innerText,
    };
  }
}

HyperLink.blotName = 'hyperLink';
HyperLink.tagName = 'span';
HyperLink.className = 'hyper-link';

Quill.register(HyperLink);

# Snippets de référence pour développement rapide

## Structure section Liquid type
```liquid
{% comment %} Section: Nom descriptif {% endcomment %}
<div class="section-{{ section.id }}">
  {% for block in section.blocks %}
    <div {{ block.shopify_attributes }}>
      {{ block.settings.content }}
    </div>
  {% endfor %}
</div>

{% schema %}
{
  "name": "Section Name",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Default text"
    }
  ],
  "blocks": [
    {
      "type": "item",
      "name": "Item",
      "settings": []
    }
  ],
  "presets": [
    {
      "name": "Section Name"
    }
  ]
}
{% endschema %}
```

## Pattern accordéon accessible
[Inclure des exemples de code réutilisables]

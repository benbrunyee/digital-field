# PDF Templating

```mermaid
flowchart TD
  A[Start] --> B[[Is template custom?]]
  B --> Yes --> C["Template uses {{ item_ref }}"]
  B --> No --> C

  C --> E[Render template]
```

## Example templates

### Text template (Default)

```handlebars
<span>
  {{ item_ref }}
</span>
```

### Text template (Custom)

```handlebars
<span style="text-align: center;">
  {{ item_ref }}
</span>
```

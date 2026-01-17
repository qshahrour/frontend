{{- define "env" }}
{{- range $name, $_ := .Values.app.env }}
- name: {{ $name }}
  key: {{ $name }}
{{- end }}
{{- end }}

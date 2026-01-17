{{- define "env" }}
{{- range $name, $_ := .Values.app.env }}
- name: {{ $name }}
{{- end }}
{{- end }}

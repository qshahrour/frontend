{{- define "env" }}
{{- range $key, $value := .Values.app.env }}
- name: {{ $key }}
  value: {{ $value | quote }}
{{- end }}
{{- end }}

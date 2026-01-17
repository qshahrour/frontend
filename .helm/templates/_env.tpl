{{- define "env" }}
{{- range .Values.app.env }}
- name: {{ $name }}
  value: {{ .value | quote }}
{{- end }}
{{- end }}

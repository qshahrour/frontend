{{- define "env" }}
{{- range $name, $_ := .Values.app.env }}
- name: {{ $name }}
  value: {{ .value | quote }}
{{- end }}
{{- end }}

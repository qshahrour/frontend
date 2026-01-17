{{- define "env" }}
{{- range $name, $_ := .Values.app.env }}
- name: {{ $name }}
  valueFrom:
    secretKeyRef:
      name: {{ $.Chart.Name }}
      key: {{ $name }}
{{- end }}
{{- end }}

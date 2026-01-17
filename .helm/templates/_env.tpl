{{- define "env" }}
{{- range .Values.app.env }}
- name: {{ $name }}
  valueFrom:
    secretKeyRef:
      name: {{ $.Chart.Name }}-env
      key: {{ $name }}
{{- end }}
{{- end }}

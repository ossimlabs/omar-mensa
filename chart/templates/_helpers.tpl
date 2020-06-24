{{- define "omar-mensa.imagePullSecret" }}
{{- printf "{\"auths\": {\"%s\": {\"auth\": \"%s\"}}}" .Values.global.imagePullSecret.registry (printf "%s:%s" .Values.global.imagePullSecret.username .Values.global.imagePullSecret.password | b64enc) | b64enc }}
{{- end }}

{{/* Template for env vars */}}
{{- define "omar-mensa.envVars" -}}
  {{- range $key, $value := .Values.envVars }}
  - name: {{ $key | quote }}
    value: {{ $value | quote }}
  {{- end }}
{{- end -}}





{{/* Templates for the volumeMounts section */}}

{{- define "omar-mensa.volumeMounts.configmaps" -}}
{{- range $configmap := .Values.configmaps}}
- name: {{ $configmap.internalName | quote }}
  mountPath: {{ $configmap.mountPath | quote }}
  {{- if $configmap.subPath }}
  subPath: {{ $configmap.subPath | quote }}
  {{- end }}
{{- end -}}
{{- end -}}

{{- define "omar-mensa.volumeMounts.pvcs" -}}
{{- range $volumeName := .Values.volumeNames }}
{{- $volumeDict := index $.Values.global.volumes $volumeName }}
- name: {{ $volumeName }}
  mountPath: {{ $volumeDict.mountPath }}
  {{- if $volumeDict.subPath }}
  subPath: {{ $volumeDict.subPath | quote }}
  {{- end }}
{{- end -}}
{{- end -}}

{{- define "omar-mensa.volumeMounts" -}}
{{- include "omar-mensa.volumeMounts.configmaps" . -}}
{{- include "omar-mensa.volumeMounts.pvcs" . -}}
{{- end -}}





{{/* Templates for the volumes section */}}

{{- define "omar-mensa.volumes.configmaps" -}}
{{- range $configmap := .Values.configmaps}}
- name: {{ $configmap.internalName | quote }}
  configMap:
    name: {{ $configmap.name | quote }}
{{- end -}}
{{- end -}}

{{- define "omar-mensa.volumes.pvcs" -}}
{{- range $volumeName := .Values.volumeNames }}
{{- $volumeDict := index $.Values.global.volumes $volumeName }}
- name: {{ $volumeName }}
  persistentVolumeClaim:
    claimName: "{{ $.Values.appName }}-{{ $volumeName }}-pvc"
{{- end -}}
{{- end -}}

{{- define "omar-mensa.volumes" -}}
{{- include "omar-mensa.volumes.configmaps" . -}}
{{- include "omar-mensa.volumes.pvcs" . -}}
{{- end -}}

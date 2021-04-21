pactl load-module module-null-sink sink_name=vsink sink_properties=device.description=vsink
pactl load-module module-remap-source master=vsink.monitor source_name=VSink source_properties="device.description=VSink"

# if you want to use your micro as well
micro=alsa_input.usb-GeneralPlus_USB_Audio_Device-00.mono-fallback
pactl load-module module-null-sink sink_name=vsink_mix sink_properties=device.description=VSinkMix
pactl load-module module-loopback latency_msec=60 adjust_time=6 source="$micro" sink=vsink_mix
pactl load-module module-loopback latency_msec=60 adjust_time=6 source=vsink.monitor sink=vsink_mix
pactl load-module module-remap-source master=vsink_mix.monitor source_name=VSinkMix source_properties="device.description=VSinkMix"